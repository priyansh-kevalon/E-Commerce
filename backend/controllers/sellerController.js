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

// Fetch the product ids that belong to the current seller.
const getSellerProductIds = async (sellerId) => {
  const products = await Product.find({ seller: sellerId }).select('_id').lean();
  return products.map((product) => product._id);
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

/**
 * @route   GET /api/seller/overview
 * @desc    Seller dashboard key figures and recent orders
 * @access  Private/Seller
 */
export const getOverview = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const productIds = await getSellerProductIds(sellerId);

    const [productsCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      Product.countDocuments({ seller: sellerId }),
      Product.countDocuments({ seller: sellerId, status: 'pending' }),
      Product.countDocuments({ seller: sellerId, status: 'approved' }),
      Product.countDocuments({ seller: sellerId, status: 'rejected' }),
    ]);

    const stats = {
      products: productsCount,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      orders: 0,
      revenue: 0,
    };

    let recentOrders = [];

    if (productIds.length) {
      const pipeline = [
        { $match: { 'orderItems.product': { $in: productIds } } },
        { $unwind: '$orderItems' },
        {
          $match: {
            'orderItems.product': { $in: productIds },
            orderStatus: { $ne: 'Cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            orders: { $addToSet: '$_id' },
            revenue: {
              $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] },
            },
          },
        },
      ];

      const [aggregated] = await Order.aggregate(pipeline);
      if (aggregated) {
        stats.orders = aggregated.orders.length;
        stats.revenue = Math.round(aggregated.revenue);
      }

      recentOrders = await Order.find({ 'orderItems.product': { $in: productIds } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email');
    }

    return successResponse(res, 'Seller overview fetched', {
      overview: { ...stats, recentOrders },
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