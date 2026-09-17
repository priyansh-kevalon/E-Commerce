import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { validateOrder } from '../validators/orderValidator.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

// Keep in sync with the storefront's shipping rules.
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 49;

const effectivePrice = (product) => {
  const discount = Number(product?.discountPrice) || 0;
  const price = Number(product?.price) || 0;
  return discount > 0 ? discount : price;
};

const canCancel = (status) =>
  ['Pending', 'Confirmed', 'Processing'].includes(status);

/**
 * @route   POST /api/orders
 * @desc    Place an order from the authenticated user's cart
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  try {
    const errors = validateOrder(req.body);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const { shippingAddress, paymentMethod = 'COD' } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 'Your cart is empty', 400);
    }

    // Re-price against the live catalogue and confirm stock before charging.
    const orderItems = [];
    const stockUpdates = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return errorResponse(res, 'A product in your cart is no longer available', 400);
      }
      if (product.stock < item.quantity) {
        return errorResponse(
          res,
          `Not enough stock for "${product.name}". Only ${product.stock} left.`,
          400
        );
      }

      const unitPrice = effectivePrice(product);
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: unitPrice,
        quantity: item.quantity,
      });
      subtotal += unitPrice * item.quantity;
      stockUpdates.push({ product, quantity: item.quantity });
    }

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const totalAmount = subtotal + shippingCost;

    // Reserve stock atomically. Standalone MongoDB has no multi-document
    // transactions, so a guarded $inc prevents overselling and we roll back by
    // hand if a later line (or the order insert) fails.
    const reserved = [];
    for (const { product, quantity } of stockUpdates) {
      const reservedProduct = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!reservedProduct) {
        for (const line of reserved) {
          await Product.updateOne({ _id: line.product }, { $inc: { stock: line.quantity } });
        }
        return errorResponse(
          res,
          `Not enough stock for "${product.name}". Only ${product.stock} left.`,
          400
        );
      }

      reserved.push({ product: product._id, quantity });
    }

    let order;
    try {
      order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        orderStatus: 'Pending',
        subtotal,
        shippingCost,
        totalAmount,
      });
    } catch (createError) {
      for (const line of reserved) {
        await Product.updateOne({ _id: line.product }, { $inc: { stock: line.quantity } });
      }
      throw createError;
    }

    cart.items = [];
    await cart.save();

    return successResponse(res, 'Order placed successfully', { order }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/myorders
 * @desc    List the authenticated user's orders (newest first)
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 'Orders fetched successfully', { orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get a single order (owner or admin)
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return errorResponse(res, 'You are not authorized to view this order', 403);
    }

    return successResponse(res, 'Order fetched successfully', { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel an order that has not shipped yet and restore stock
 * @access  Private
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return errorResponse(res, 'You are not authorized to cancel this order', 403);
    }

    if (!canCancel(order.orderStatus)) {
      return errorResponse(res, `An order that is ${order.orderStatus} can no longer be cancelled`, 400);
    }

    for (const item of order.orderItems) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    return successResponse(res, 'Order cancelled successfully', { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders
 * @desc    List every order (admin) with optional status/search filters
 * @access  Private/Admin
 */
export const getOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

    const filter = {};
    if (status) {
      if (!ORDER_STATUSES.includes(status)) {
        return errorResponse(res, `Status filter must be one of: ${ORDER_STATUSES.join(', ')}`, 400);
      }
      filter.orderStatus = status;
    }

    if (search && String(search).trim()) {
      const term = String(search).trim();
      const regex = new RegExp(escapeRegex(term), 'i');
      const or = [{ 'shippingAddress.fullName': regex }];

      if (mongoose.Types.ObjectId.isValid(term)) {
        or.push({ _id: term });
      }

      const matchedUsers = await User.find({ $or: [{ name: regex }, { email: regex }] }).select('_id');
      if (matchedUsers.length) {
        or.push({ user: { $in: matchedUsers.map((u) => u._id) } });
      }

      filter.$or = or;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('user', 'name email'),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return successResponse(res, 'Orders fetched successfully', {
      orders,
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
 * @route   PUT /api/orders/:id/status
 * @desc    Move an order through its lifecycle (admin)
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return errorResponse(res, `Status must be one of: ${ORDER_STATUSES.join(', ')}`, 400);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    if (order.orderStatus === status) {
      return successResponse(res, 'Order status is already up to date', { order });
    }

    if (status === 'Cancelled') {
      if (!canCancel(order.orderStatus)) {
        return errorResponse(res, `An order that is ${order.orderStatus} can no longer be cancelled`, 400);
      }
      // Return the reserved stock to the catalogue.
      for (const item of order.orderItems) {
        await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
      }
    }

    order.orderStatus = status;
    if (status === 'Delivered' && order.paymentStatus !== 'Paid') {
      order.paymentStatus = 'Paid';
    }

    await order.save();
    await order.populate('user', 'name email');

    return successResponse(res, 'Order status updated successfully', { order });
  } catch (error) {
    next(error);
  }
};
