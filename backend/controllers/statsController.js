import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { successResponse } from '../utils/responseHandler.js';

const LOW_STOCK_THRESHOLD = 5;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const periodWindows = () => {
  const now = new Date();
  return [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This week' },
    { key: 'month', label: 'This month' },
    { key: 'year', label: 'This year' },
  ].map((period) => {
    let start;
    if (period.key === 'today') {
      start = startOfDay(now);
    } else if (period.key === 'week') {
      const day = startOfDay(now);
      day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
      start = day;
    } else if (period.key === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      start = new Date(now.getFullYear(), 0, 1);
    }

    let prevStart;
    if (period.key === 'today') prevStart = new Date(start.getTime() - DAY);
    else if (period.key === 'week') prevStart = new Date(start.getTime() - 7 * DAY);
    else if (period.key === 'month')
      prevStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
    else prevStart = new Date(start.getFullYear() - 1, 0, 1);

    return { ...period, start, prevStart };
  });
};

const growthOf = (current, previous) =>
  previous > 0 ? ((current - previous) / previous) * 100 : current > 0 ? 100 : 0;

/**
 * @route   GET /api/admin/stats
 * @desc    Aggregate analytics for the admin dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [userCount, customerCount, productCount, categoryCount, orderCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
    ]);

    const [revenueAgg, statusAgg] = await Promise.all([
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    const orderStatusBreakdown = statusAgg.reduce(
      (acc, entry) => ({ ...acc, [entry._id]: entry.count }),
      {}
    );

    const pendingOrders =
      (orderStatusBreakdown.Pending || 0) +
      (orderStatusBreakdown.Confirmed || 0) +
      (orderStatusBreakdown.Processing || 0);

    const [recentOrders, lowStockProducts, topProducts, monthlyAgg] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
        .sort({ stock: 1 })
        .limit(5)
        .select('name stock price images category')
        .populate('category', 'name'),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $unwind: '$orderItems' },
        {
          $group: {
            _id: '$orderItems.product',
            name: { $first: '$orderItems.name' },
            image: { $first: '$orderItems.image' },
            sold: { $sum: '$orderItems.quantity' },
            revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: 5 },
      ]),
      (() => {
        const since = new Date();
        since.setMonth(since.getMonth() - 5);
        since.setDate(1);
        since.setHours(0, 0, 0, 0);
        return Order.aggregate([
          { $match: { createdAt: { $gte: since }, orderStatus: { $ne: 'Cancelled' } } },
          {
            $group: {
              _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
              revenue: { $sum: '$totalAmount' },
              orders: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
      })(),
    ]);

    const monthlySales = monthlyAgg.map((entry) => ({
      label: `${MONTHS[entry._id.month - 1]} ${String(entry._id.year).slice(-2)}`,
      revenue: entry.revenue,
      orders: entry.orders,
    }));

    // Sales analytics: today / this week / this month / this year (+ growth vs previous period)
    const windows = periodWindows();
    const salesAgg = await Promise.all(
      windows.map((period) =>
        Order.aggregate([
          { $match: { createdAt: { $gte: period.prevStart }, orderStatus: { $ne: 'Cancelled' } } },
          {
            $group: {
              _id: null,
              revenue: { $sum: { $cond: [{ $gte: ['$createdAt', period.start] }, '$totalAmount', 0] } },
              orders: { $sum: { $cond: [{ $gte: ['$createdAt', period.start] }, 1, 0] } },
              prevRevenue: {
                $sum: { $cond: [{ $lt: ['$createdAt', period.start] }, '$totalAmount', 0] },
              },
              prevOrders: { $sum: { $cond: [{ $lt: ['$createdAt', period.start] }, 1, 0] } },
            },
          },
        ])
      )
    );

    const salesByPeriod = salesAgg.map((entries, index) => {
      const current = entries[0] || { revenue: 0, orders: 0, prevRevenue: 0, prevOrders: 0 };
      return {
        key: windows[index].key,
        label: windows[index].label,
        revenue: current.revenue,
        orders: current.orders,
        aov: current.orders ? current.revenue / current.orders : 0,
        revenueGrowth: growthOf(current.revenue, current.prevRevenue),
        ordersGrowth: growthOf(current.orders, current.prevOrders),
      };
    });

    // Sales by category (units + revenue share), uncategorised products grouped together.
    const categoryAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$category.name', 'Uncategorized'] },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
          units: { $sum: '$orderItems.quantity' },
          orderIds: { $addToSet: '$_id' },
        },
      },
      { $addFields: { orders: { $size: '$orderIds' } } },
      { $project: { orderIds: 0 } },
      { $sort: { revenue: -1 } },
    ]);

    const categoryRevenue = categoryAgg.reduce((sum, entry) => sum + entry.revenue, 0);
    const salesByCategory = categoryAgg.map((entry) => ({
      name: entry._id,
      revenue: entry.revenue,
      units: entry.units,
      orders: entry.orders,
      share: categoryRevenue > 0 ? (entry.revenue / categoryRevenue) * 100 : 0,
    }));

    // Customer analytics: new, returning, repeat purchase rate.
    const thirtyDaysAgo = new Date(Date.now() - 30 * DAY);
    const [newCustomers30d, returningAgg] = await Promise.all([
      User.countDocuments({ role: 'customer', createdAt: { $gte: thirtyDaysAgo } }),
      Order.aggregate([
        { $group: { _id: '$user', count: { $sum: 1 } } },
        {
          $group: {
            _id: null,
            withOrders: { $sum: 1 },
            returning: { $sum: { $cond: [{ $gte: ['$count', 2] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const returningInfo = returningAgg[0] || { withOrders: 0, returning: 0 };
    const customerAnalytics = {
      total: customerCount,
      new30d: newCustomers30d,
      returning: returningInfo.returning,
      repeatRate: returningInfo.withOrders
        ? (returningInfo.returning / returningInfo.withOrders) * 100
        : 0,
    };

    // Payment overview: online (Card/UPI) vs COD, failed payments, refunded amount.
    // Returns & refunds are derived from cancelled orders (full workflow ships later).
    const [paymentAgg, returnsAgg, alerts] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            onlineCount: {
              $sum: { $cond: [{ $in: ['$paymentMethod', ['Card', 'UPI']] }, 1, 0] },
            },
            onlineRevenue: {
              $sum: {
                $cond: [
                  { $in: ['$paymentMethod', ['Card', 'UPI']] },
                  '$totalAmount',
                  0,
                ],
              },
            },
            codCount: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'COD'] }, 1, 0] } },
            codRevenue: {
              $sum: { $cond: [{ $eq: ['$paymentMethod', 'COD'] }, '$totalAmount', 0] },
            },
            failedCount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'Failed'] }, 1, 0] },
            },
            refunded: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$orderStatus', 'Cancelled'] },
                      { $eq: ['$paymentStatus', 'Paid'] },
                    ],
                  },
                  '$totalAmount',
                  0,
                ],
              },
            },
          },
        },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: null,
            requests: {
              $sum: { $cond: [{ $eq: ['$orderStatus', 'Cancelled'] }, 1, 0] },
            },
            refunded: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$orderStatus', 'Cancelled'] },
                      { $eq: ['$paymentStatus', 'Paid'] },
                    ],
                  },
                  '$totalAmount',
                  0,
                ],
              },
            },
            approved: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$orderStatus', 'Cancelled'] },
                      { $in: ['$paymentStatus', ['Paid', 'Pending']] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            refundPending: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$orderStatus', 'Cancelled'] },
                      { $eq: ['$paymentStatus', 'Pending'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            rejected: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$orderStatus', 'Cancelled'] },
                      { $eq: ['$paymentStatus', 'Failed'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
      (async () => {
        const day = 24 * 60 * 60 * 1000;
        const [newOrders24h, newCustomers24h, returnRequests30d, paymentFailures7d] =
          await Promise.all([
            Order.countDocuments({ createdAt: { $gte: new Date(Date.now() - day) } }),
            User.countDocuments({ role: 'customer', createdAt: { $gte: new Date(Date.now() - day) } }),
            Order.countDocuments({
              orderStatus: 'Cancelled',
              createdAt: { $gte: new Date(Date.now() - 30 * day) },
            }),
            Order.countDocuments({
              paymentStatus: 'Failed',
              createdAt: { $gte: new Date(Date.now() - 7 * day) },
            }),
          ]);
        return { newOrders24h, newCustomers24h, returnRequests30d, paymentFailures7d };
      })(),
    ]);

    const payments = paymentAgg[0] || {
      onlineCount: 0,
      onlineRevenue: 0,
      codCount: 0,
      codRevenue: 0,
      failedCount: 0,
      refunded: 0,
    };
    const returns = returnsAgg[0] || {
      requests: 0,
      refunded: 0,
      approved: 0,
      refundPending: 0,
      rejected: 0,
    };

    const paymentOverview = {
      onlineCount: payments.onlineCount,
      onlineRevenue: payments.onlineRevenue,
      codCount: payments.codCount,
      codRevenue: payments.codRevenue,
      failedCount: payments.failedCount,
      refunded: payments.refunded,
    };

    const returnsRefunds = {
      requests: returns.requests,
      approved: returns.approved,
      refundPending: returns.refundPending,
      rejected: returns.rejected,
      refunded: returns.refunded,
      derived: true,
    };

    return successResponse(res, 'Dashboard stats fetched successfully', {
      totals: {
        users: userCount,
        customers: customerCount,
        products: productCount,
        categories: categoryCount,
        orders: orderCount,
        revenue,
        pendingOrders,
      },
      orderStatusBreakdown,
      recentOrders,
      topProducts,
      lowStockProducts,
      monthlySales,
      salesByPeriod,
      salesByCategory,
      customerAnalytics,
      paymentOverview,
      returnsRefunds,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};