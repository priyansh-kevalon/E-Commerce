import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { successResponse } from '../utils/responseHandler.js';

const LOW_STOCK_THRESHOLD = 5;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @route   GET /api/admin/stats
 * @desc    Aggregate counts and revenue for the admin dashboard
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
    });
  } catch (error) {
    next(error);
  }
};
