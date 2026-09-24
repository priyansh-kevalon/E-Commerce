import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Fields the frontend needs to render a cart line item.
const PRODUCT_FIELDS = 'name price discountPrice images stock brand category rating numReviews';

// Effective (discounted) unit price stored on the cart line.
const effectivePrice = (product) => {
  const discount = Number(product?.discountPrice) || 0;
  const price = Number(product?.price) || 0;
  return discount > 0 ? discount : price;
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const populateCart = (cart) =>
  cart.populate({ path: 'items.product', select: PRODUCT_FIELDS });

// Normalise the cart document into the API payload the frontend consumes.
const buildPayload = (cart) => {
  const items = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: effectivePrice(item.product),
    }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart: {
      _id: cart._id,
      user: cart.user,
      items,
      subtotal,
      totalItems,
    },
  };
};

/**
 * @route   GET /api/cart
 * @desc    Get the authenticated user's cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    await populateCart(cart);
    return successResponse(res, 'Cart fetched successfully', buildPayload(cart));
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/cart
 * @desc    Add a product to the cart (merges with an existing line)
 * @body    { productId, quantity? }
 * @access  Private
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, 'A valid product id is required', 400);
    }

    const requested = Number(quantity);
    if (!Number.isInteger(requested) || requested < 1) {
      return errorResponse(res, 'Quantity must be a whole number of 1 or more', 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    if (product.stock <= 0) {
      return errorResponse(res, 'This product is out of stock', 400);
    }

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((item) => item.product.toString() === productId);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + requested, product.stock);
      existing.price = effectivePrice(product);
    } else {
      cart.items.push({
        product: product._id,
        quantity: Math.min(requested, product.stock),
        price: effectivePrice(product),
      });
    }

    await cart.save();
    await populateCart(cart);
    // New line -> 201 Created, merged quantity -> 200 OK.
    return successResponse(
      res,
      'Item added to cart',
      buildPayload(cart),
      existing ? 200 : 201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/cart/:productId
 * @desc    Set the quantity of a cart line (quantity <= 0 removes it)
 * @access  Private
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const rawQuantity = req.body.quantity;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, 'A valid product id is required', 400);
    }

    const quantity = Number(rawQuantity);
    const quantityMissing =
      rawQuantity === undefined || rawQuantity === null || String(rawQuantity).trim() === '';
    if (quantityMissing || !Number.isInteger(quantity) || quantity < 0) {
      return errorResponse(res, 'Quantity must be a whole number of 0 or more', 400);
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((line) => line.product.toString() === productId);

    if (!item) {
      return errorResponse(res, 'Item is not in the cart', 404);
    }

    if (quantity === 0) {
      cart.items.pull(item);
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return errorResponse(res, 'Product not found', 404);
      }
      if (product.stock <= 0) {
        return errorResponse(res, 'This product is out of stock', 400);
      }
      item.quantity = Math.min(quantity, product.stock);
      item.price = effectivePrice(product);
    }

    await cart.save();
    await populateCart(cart);
    return successResponse(res, 'Cart updated successfully', buildPayload(cart));
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove a single product from the cart
 * @access  Private
 */
export const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, 'A valid product id is required', 400);
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((line) => line.product.toString() === productId);

    if (!item) {
      return errorResponse(res, 'Item is not in the cart', 404);
    }

    cart.items.pull(item);
    await cart.save();
    await populateCart(cart);
    return successResponse(res, 'Item removed from cart', buildPayload(cart));
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cart
 * @desc    Empty the cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    return successResponse(res, 'Cart cleared successfully', buildPayload(cart));
  } catch (error) {
    next(error);
  }
};
