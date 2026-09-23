import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { validateProduct } from '../validators/productValidator.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toNumber = (value) => {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const LOW_STOCK_THRESHOLD = 5;
const PLATFORM_FEE_RATE = 0.05;
const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const roundTo = (value, decimals = 1) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const growthPercent = (current, previous) => {
  if (previous > 0) return roundTo(((current - previous) / previous) * 100);
  return current > 0 ? 100 : 0;
};

const monthEndDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

// Fetch the product ids that belong to the current seller.
const getSellerProductIds = async (sellerId) => {
  const products = await Product.find({ seller: sellerId }).select('_id').lean();
  return products.map((product) => product._id);
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

/**
 * @route   GET /api/seller/overview
 * @desc    Full seller dashboard: KPIs, sales performance, inventory,
 *          earnings, store performance, notifications and store health
 * @access  Private/Seller
 */
export const getOverview = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const sellerIdObject = new mongoose.Types.ObjectId(sellerId);
    const productIds = await getSellerProductIds(sellerId);
    const now = new Date();
    const nowTs = now.getTime();

    // --- Product buckets by status + approval-weighted rating / inventory ---
    const productBuckets = await Product.aggregate([
      { $match: { seller: sellerIdObject } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          ratingWeighted: {
            $sum: {
              $multiply: ['$rating', { $cond: [{ $gt: ['$numReviews', 0] }, '$numReviews', 1] }],
            },
          },
          weightSum: { $sum: { $cond: [{ $gt: ['$numReviews', 0] }, '$numReviews', 1] } },
          reviews: { $sum: '$numReviews' },
        },
      },
    ]);

    let totalProducts = 0;
    let pendingProducts = 0;
    let approvedProductsCount = 0;
    let rejectedProducts = 0;
    let approvedRating = 0;
    let approvedReviews = 0;

    productBuckets.forEach((bucket) => {
      totalProducts += bucket.count;
      if (bucket._id === 'pending') pendingProducts = bucket.count;
      if (bucket._id === 'approved') {
        approvedProductsCount = bucket.count;
        approvedRating = bucket.weightSum > 0 ? bucket.ratingWeighted / bucket.weightSum : 0;
        approvedReviews = bucket.reviews || 0;
      }
      if (bucket._id === 'rejected') rejectedProducts = bucket.count;
    });
    approvedRating = roundTo(approvedRating);

    // --- Approved catalogue for inventory metrics & worst performers ---
    const approvedProducts = await Product.find({ seller: sellerId, status: 'approved' })
      .select('name images stock price discountPrice rating')
      .lean();

    let totalStock = 0;
    let inventoryValue = 0;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outStockCount = 0;

    approvedProducts.forEach((product) => {
      const stock = product.stock || 0;
      const price = (product.discountPrice || 0) > 0 ? product.discountPrice : product.price || 0;
      totalStock += stock;
      inventoryValue += price * stock;
      if (stock === 0) outStockCount += 1;
      else if (stock <= LOW_STOCK_THRESHOLD) lowStockCount += 1;
      else inStockCount += 1;
    });

    const lowStockItems = approvedProducts
      .filter((product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 6);

    // --- Orders containing at least one of the seller's products ---
    let orders = [];
    if (productIds.length) {
      orders = await Order.find({ 'orderItems.product': { $in: productIds } })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    }

    const isMine = (objectId) => productIds.some((id) => id.equals(objectId));

    const soldOrderIds = new Set();
    const performance = {};
    let totalRevenue = 0;
    let unitsSold = 0;
    let refundedAmount = 0;
    let toProcessOrders = 0;
    let paymentIssues = 0;
    let newOrders24h = 0;
    let cancelled30d = 0;
    let cancelled7d = 0;

    orders.forEach((order) => {
      const cancelled = order.orderStatus === 'Cancelled';
      const timestamp = new Date(order.createdAt).getTime();
      const sellerItems = order.orderItems.filter((item) => isMine(item.product));
      const orderRevenue = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderUnits = sellerItems.reduce((sum, item) => sum + item.quantity, 0);

      if (nowTs - timestamp <= DAY_MS) newOrders24h += 1;

      if (cancelled) {
        refundedAmount += orderRevenue;
        if (nowTs - timestamp <= 7 * DAY_MS) cancelled7d += 1;
        if (nowTs - timestamp <= 30 * DAY_MS) cancelled30d += 1;
      } else {
        soldOrderIds.add(String(order._id));
        totalRevenue += orderRevenue;
        unitsSold += orderUnits;
        if (order.orderStatus === 'Pending' || order.orderStatus === 'Processing') {
          toProcessOrders += 1;
        }
      }

      if (order.paymentStatus === 'Failed') paymentIssues += 1;

      if (!cancelled) {
        sellerItems.forEach((item) => {
          const key = String(item.product);
          if (!performance[key]) {
            performance[key] = { unitsSold: 0, revenue: 0, orderIds: new Set() };
          }
          performance[key].unitsSold += item.quantity;
          performance[key].revenue += item.price * item.quantity;
          performance[key].orderIds.add(String(order._id));
        });
      }
    });

    const totalOrdersCount = orders.length;
    const deliveredOrders = orders.filter((order) => order.orderStatus === 'Delivered').length;
    const totalSales = Math.round(totalRevenue);
    const platformFee = Math.round(totalSales * PLATFORM_FEE_RATE);
    const refunds = Math.round(refundedAmount);
    const netEarnings = Math.round(totalSales - platformFee - refunds);

    // --- Sales performance across 7 / 30 / 90 days with previous-period comparison ---
    const ranges = [
      { key: '7d', days: 7 },
      { key: '30d', days: 30 },
      { key: '90d', days: 90 },
    ];

    const sales = {};
    ranges.forEach(({ key, days }) => {
      const currentStart = new Date(nowTs - (days - 1) * DAY_MS);
      currentStart.setHours(0, 0, 0, 0);
      const currentStartTs = currentStart.getTime();
      const previousStartTs = currentStartTs - days * DAY_MS;

      const daily = [];
      for (let offset = days - 1; offset >= 0; offset -= 1) {
        const dayStart = new Date(nowTs - offset * DAY_MS);
        dayStart.setHours(0, 0, 0, 0);
        daily.push({
          start: dayStart.getTime(),
          end: dayStart.getTime() + DAY_MS,
          label: `${dayStart.getDate()} ${MONTHS[dayStart.getMonth()]}`,
          revenue: 0,
          orders: 0,
          units: 0,
          seen: new Set(),
        });
      }

      let currentRevenue = 0;
      let currentOrders = 0;
      let currentUnits = 0;
      let previousRevenue = 0;
      let previousOrders = 0;
      let previousUnits = 0;
      const currentSeen = new Set();
      const previousSeen = new Set();

      orders.forEach((order) => {
        if (order.orderStatus === 'Cancelled') return;
        const sellerItems = order.orderItems.filter((item) => isMine(item.product));
        if (!sellerItems.length) return;
        const timestamp = new Date(order.createdAt).getTime();
        const orderRevenue = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderUnits = sellerItems.reduce((sum, item) => sum + item.quantity, 0);

        if (timestamp >= currentStartTs) {
          currentRevenue += orderRevenue;
          currentUnits += orderUnits;
          if (!currentSeen.has(String(order._id))) {
            currentSeen.add(String(order._id));
            currentOrders += 1;
          }
          const day = daily.find((slot) => timestamp >= slot.start && timestamp < slot.end);
          if (day) {
            day.revenue += orderRevenue;
            day.units += orderUnits;
            if (!day.seen.has(String(order._id))) {
              day.seen.add(String(order._id));
              day.orders += 1;
            }
          }
        } else if (timestamp >= previousStartTs && timestamp < currentStartTs) {
          previousRevenue += orderRevenue;
          previousUnits += orderUnits;
          if (!previousSeen.has(String(order._id))) {
            previousSeen.add(String(order._id));
            previousOrders += 1;
          }
        }
      });

      const currentRevenueRounded = Math.round(currentRevenue);
      const previousRevenueRounded = Math.round(previousRevenue);

      sales[key] = {
        days,
        revenue: currentRevenueRounded,
        orders: currentOrders,
        units: currentUnits,
        previousRevenue: previousRevenueRounded,
        previousOrders,
        previousUnits,
        revenueGrowth: growthPercent(currentRevenueRounded, previousRevenueRounded),
        ordersGrowth: growthPercent(currentOrders, previousOrders),
        unitsGrowth: growthPercent(currentUnits, previousUnits),
        daily: daily.map(({ start, end, seen, ...rest }) => rest),
      };
    });

    // --- Top selling products ---
    const topProductIds = Object.entries(performance)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 6)
      .map(([id]) => id);

    const performanceDocMap = {};
    if (topProductIds.length) {
      const performanceDocs = await Product.find({ _id: { $in: topProductIds } })
        .select('name images rating')
        .lean();
      performanceDocs.forEach((product) => {
        performanceDocMap[String(product._id)] = product;
      });
    }

    const topProducts = topProductIds
      .map((id) => {
        const product = performanceDocMap[id];
        const stats = performance[id];
        if (!product) return null;
        return {
          _id: id,
          name: product.name,
          image: product.images?.[0] || '',
          rating: product.rating || 0,
          unitsSold: stats.unitsSold,
          revenue: Math.round(stats.revenue),
          orders: stats.orderIds.size,
        };
      })
      .filter(Boolean);

    // --- Worst performers (approved products with no sales yet) ---
    const soldKeys = new Set(Object.keys(performance));
    const noSalesProducts = approvedProducts.filter((product) => !soldKeys.has(String(product._id)));
    const noSales = {
      count: noSalesProducts.length,
      products: noSalesProducts.slice(0, 5).map((product) => product.name),
    };

    // --- Recent orders (seller-relevant line items) ---
    const recentOrders = orders.slice(0, 6).map((order) => {
      const sellerItems = order.orderItems.filter((item) => isMine(item.product));
      const first = sellerItems[0] || {};
      return {
        _id: order._id,
        ref: String(order._id).slice(-6).toUpperCase(),
        customer: order.user?.name || 'Guest',
        productName: first.name || '',
        productImage: first.image || '',
        quantity: sellerItems.reduce((sum, item) => sum + item.quantity, 0),
        amount: Math.round(sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0)),
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
      };
    });

    // --- Action required ---
    const actionRequired = {
      pendingApprovals: pendingProducts,
      ordersToProcess: toProcessOrders,
      lowStockProducts: lowStockCount,
      outOfStockProducts: outStockCount,
      returnRequests: cancelled30d,
      paymentIssues,
    };

    // --- Earnings & payouts ---
    const earnings = {
      totalSales,
      platformFeeRate: Math.round(PLATFORM_FEE_RATE * 100),
      platformFee,
      refunds,
      netEarnings,
      pendingPayout: netEarnings,
      nextPayout: monthEndDate().toISOString(),
      payoutHistory: [],
    };

    // --- Store performance ---
    const store = {
      rating: approvedRating,
      reviews: approvedReviews,
      orderCompletionRate: totalOrdersCount ? Math.round((deliveredOrders / totalOrdersCount) * 100) : 0,
      cancellationRate: totalOrdersCount
        ? Math.round((orders.filter((order) => order.orderStatus === 'Cancelled').length / totalOrdersCount) * 100)
        : 0,
      returnRate: totalSales + refunds > 0 ? roundTo((refunds / (totalSales + refunds)) * 100) : 0,
      productCount: approvedProductsCount,
    };

    // --- Notifications (derived from live store activity) ---
    const notifications = [];
    if (newOrders24h > 0) {
      notifications.push({
        type: 'order',
        message: `${newOrders24h} new order${newOrders24h === 1 ? '' : 's'} in the last 24 hours`,
        date: now.toISOString(),
        link: '/seller/orders',
      });
    }
    if (toProcessOrders > 0) {
      notifications.push({
        type: 'process',
        message: `${toProcessOrders} order${toProcessOrders === 1 ? '' : 's'} waiting for processing`,
        date: now.toISOString(),
        link: '/seller/orders',
      });
    }
    if (pendingProducts > 0) {
      notifications.push({
        type: 'pending',
        message: `${pendingProducts} product${pendingProducts === 1 ? '' : 's'} awaiting admin approval`,
        date: now.toISOString(),
        link: '/seller/products',
      });
    }
    if (rejectedProducts > 0) {
      notifications.push({
        type: 'rejected',
        message: `${rejectedProducts} product${rejectedProducts === 1 ? '' : 's'} did not pass approval`,
        date: now.toISOString(),
        link: '/seller/products',
      });
    }
    if (lowStockCount > 0) {
      notifications.push({
        type: 'stock',
        message: `${lowStockCount} product${lowStockCount === 1 ? '' : 's'} low on stock`,
        date: now.toISOString(),
        link: '/seller/products',
      });
    }
    if (outStockCount > 0) {
      notifications.push({
        type: 'out',
        message: `${outStockCount} product${outStockCount === 1 ? '' : 's'} are out of stock`,
        date: now.toISOString(),
        link: '/seller/products',
      });
    }
    if (paymentIssues > 0) {
      notifications.push({
        type: 'payment',
        message: `${paymentIssues} failed payment${paymentIssues === 1 ? '' : 's'} on your orders`,
        date: now.toISOString(),
        link: '/seller/orders',
      });
    }
    if (cancelled7d > 0) {
      notifications.push({
        type: 'refund',
        message: `${cancelled7d} cancellation${cancelled7d === 1 ? '' : 's'} in the last 7 days`,
        date: now.toISOString(),
        link: '/seller/orders',
      });
    }

    const stats = {
      products: totalProducts,
      pending: pendingProducts,
      approved: approvedProductsCount,
      rejected: rejectedProducts,
      orders: soldOrderIds.size,
      revenue: totalSales,
      unitsSold,
      avgOrderValue: soldOrderIds.size ? Math.round(totalRevenue / soldOrderIds.size) : 0,
    };

    const inventoryValueRounded = Math.round(inventoryValue);

    return successResponse(res, 'Seller dashboard fetched', {
      overview: {
        ...stats,
        kpi: stats,
        actionRequired,
        sales,
        recentOrders,
        inventory: {
          totalStock,
          inStock: inStockCount,
          lowStock: lowStockCount,
          outOfStock: outStockCount,
          inventoryValue: inventoryValueRounded,
        },
        lowStockItems,
        topProducts,
        productPerformance: {
          trackedViews: false,
          products: topProducts.map((product) => ({
            _id: product._id,
            name: product.name,
            rating: product.rating,
            orders: product.orders,
            revenue: product.revenue,
          })),
          noSales,
        },
        earnings,
        store,
        notifications,
        storeHealth: {
          live: approvedProductsCount,
          pending: pendingProducts,
          rejected: rejectedProducts,
          lowStock: lowStockCount,
          outOfStock: outStockCount,
        },
        timestamp: now.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/seller/products
 * @desc    List the current seller's products with filters and pagination
 * @access  Private/Seller
 */
export const getProducts = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, Math.trunc(toNumber(page) ?? 1));
    const limitNum = Math.min(100, Math.max(1, Math.trunc(toNumber(limit) ?? 12)));

    const filter = { seller: req.user._id };

    if (search && String(search).trim()) {
      const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
      filter.$or = [{ name: regex }, { brand: regex }];
    }

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return successResponse(res, 'Products fetched successfully', {
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/seller/products
 * @desc    Create a product as a seller (goes to moderation as "pending")
 * @access  Private/Seller
 */
export const createProduct = async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
      return errorResponse(res, 'Selected category does not exist', 400);
    }

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      discountPrice: req.body.discountPrice || 0,
      category: req.body.category,
      brand: req.body.brand || '',
      images: req.body.images || [],
      stock: req.body.stock || 0,
      rating: 0,
      numReviews: 0,
      isFeatured: false,
      seller: req.user._id,
      status: 'pending',
    });

    await product.populate('category', 'name');

    return successResponse(res, 'Product submitted for review', { product }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/seller/products/:id
 * @desc    Update one of the seller's own products
 * @access  Private/Seller
 */
export const updateProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, 'Invalid product id', 400);
    }

    const errors = validateProduct(req.body, true);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    if (req.body.category !== undefined) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return errorResponse(res, 'Selected category does not exist', 400);
      }
    }

    const editableFields = [
      'name',
      'description',
      'price',
      'discountPrice',
      'category',
      'brand',
      'images',
      'stock',
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    await product.save();
    await product.populate('category', 'name');

    return successResponse(res, 'Product updated successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/seller/products/:id
 * @desc    Delete one of the seller's own products
 * @access  Private/Seller
 */
export const deleteProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return errorResponse(res, 'Invalid product id', 400);
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    await product.deleteOne();
    return successResponse(res, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/seller/orders
 * @desc    List orders that contain at least one of the seller's products
 * @access  Private/Seller
 */
export const getOrders = async (req, res, next) => {
  try {
    const productIds = await getSellerProductIds(req.user._id);
    if (!productIds.length) {
      return successResponse(res, 'Orders fetched successfully', {
        orders: [],
        totalRevenue: 0,
      });
    }

    const orders = await Order.find({ 'orderItems.product': { $in: productIds } })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    const totalRevenue = orders.reduce((sum, order) => {
      if (order.orderStatus === 'Cancelled') return sum;
      return (
        sum +
        order.orderItems.reduce((itemSum, item) => {
          if (!productIds.some((id) => id.equals(item.product))) return itemSum;
          return itemSum + item.price * item.quantity;
        }, 0)
      );
    }, 0);

    return successResponse(res, 'Orders fetched successfully', {
      orders,
      totalRevenue: Math.round(totalRevenue),
    });
  } catch (error) {
    next(error);
  }
};