import mongoose from 'mongoose';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const PRODUCT_FIELDS = 'name slug price discountPrice images stock brand category rating numReviews';

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

const populateWishlist = (wishlist) =>
  wishlist.populate({ path: 'products', select: PRODUCT_FIELDS });

const buildPayload = (wishlist) => ({
  wishlist: {
    _id: wishlist._id,
    user: wishlist.user,
    products: wishlist.products,
    totalItems: wishlist.products.length,
  },
});

/**
 * @route   GET /api/wishlist
 * @desc    Get the authenticated user's wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    await populateWishlist(wishlist);
    return successResponse(res, 'Wishlist fetched successfully', buildPayload(wishlist));
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/wishlist/:productId
 * @desc    Add a product to the wishlist (no-op if already present)
 * @access  Private
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, 'A valid product id is required', 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const wishlist = await getOrCreateWishlist(req.user._id);
    const alreadySaved = wishlist.products.some((id) => id.toString() === productId);

    if (!alreadySaved) {
      wishlist.products.push(product._id);
      await wishlist.save();
    }

    await populateWishlist(wishlist);
    return successResponse(
      res,
      alreadySaved ? 'Product already in wishlist' : 'Product added to wishlist',
      buildPayload(wishlist),
      alreadySaved ? 200 : 201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/wishlist/:productId
 * @desc    Remove a product from the wishlist
 * @access  Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, 'A valid product id is required', 400);
    }

    const wishlist = await getOrCreateWishlist(req.user._id);
    const exists = wishlist.products.some((id) => id.toString() === productId);

    if (!exists) {
      return errorResponse(res, 'Product is not in the wishlist', 404);
    }

    wishlist.products.pull(productId);
    await wishlist.save();
    await populateWishlist(wishlist);
    return successResponse(res, 'Product removed from wishlist', buildPayload(wishlist));
  } catch (error) {
    next(error);
  }
};
