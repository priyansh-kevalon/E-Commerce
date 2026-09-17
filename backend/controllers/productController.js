import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { validateProduct } from '../validators/productValidator.js';

// Escape user input before using it inside a RegExp.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Whitelisted sort options exposed through ?sort=
const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { rating: -1 },
  popular: { numReviews: -1 },
  name_asc: { name: 1 },
  name_desc: { name: -1 },
};

// Parse a query value into a finite number. Blank values are treated as absent.
const toNumber = (value) => {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

// Parse an optional boolean query value. Returns undefined when absent and
// null when provided but not a recognisable boolean.
const toBoolean = (value) => {
  if (value === undefined || value === null || String(value).trim() === '') return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1'].includes(normalized)) return true;
  if (['false', '0'].includes(normalized)) return false;
  return null;
};

/**
 * @route   GET /api/products
 * @desc    List products with search, category/price/featured/stock/rating
 *          filters, sorting and pagination.
 * @access  Public
 *
 * Query params:
 *   search, category, minPrice, maxPrice, sort, page, limit,
 *   featured, inStock, minRating
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12,
      featured,
      inStock,
      minRating,
    } = req.query;

    const pageNum = Math.max(1, Math.trunc(toNumber(page) ?? 1));
    const limitNum = Math.min(100, Math.max(1, Math.trunc(toNumber(limit) ?? 12)));

    const emptyResult = {
      products: [],
      pagination: {
        total: 0,
        page: pageNum,
        limit: limitNum,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };

    const filter = {};

    // ---- Search (name / brand / description) ----
    if (search && String(search).trim()) {
      const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
      filter.$or = [{ name: regex }, { brand: regex }, { description: regex }];
    }

    // ---- Category (accepts an id or a category name) ----
    if (category && String(category).trim()) {
      const value = String(category).trim();
      if (mongoose.Types.ObjectId.isValid(value)) {
        filter.category = value;
      } else {
        const matchedCategory = await Category.findOne({
          name: new RegExp(`^${escapeRegex(value)}$`, 'i'),
        });
        if (!matchedCategory) {
          return successResponse(res, 'Products fetched successfully', emptyResult);
        }
        filter.category = matchedCategory._id;
      }
    }

    // ---- Boolean / rating filters ----
    const featuredValue = toBoolean(featured);
    if (featuredValue === null) {
      return errorResponse(res, 'featured must be either true or false', 400);
    }
    if (featuredValue !== undefined) filter.isFeatured = featuredValue;

    const inStockValue = toBoolean(inStock);
    if (inStockValue === null) {
      return errorResponse(res, 'inStock must be either true or false', 400);
    }
    if (inStockValue !== undefined) filter.stock = inStockValue ? { $gt: 0 } : { $lte: 0 };

    const ratingValue = toNumber(minRating);
    if (ratingValue !== null) {
      if (ratingValue < 0 || ratingValue > 5) {
        return errorResponse(res, 'minRating must be between 0 and 5', 400);
      }
      filter.rating = { $gte: ratingValue };
    }

    // ---- Price range (uses the effective/selling price) ----
    const priceConditions = [];
    const min = toNumber(minPrice);
    const max = toNumber(maxPrice);
    if (min !== null && min < 0) {
      return errorResponse(res, 'minPrice cannot be negative', 400);
    }
    if (max !== null && max < 0) {
      return errorResponse(res, 'maxPrice cannot be negative', 400);
    }
    if (min !== null && max !== null && min > max) {
      return errorResponse(res, 'minPrice cannot be greater than maxPrice', 400);
    }
    if (min !== null || max !== null) {
      const effectivePrice = {
        $cond: [{ $gt: ['$discountPrice', 0] }, '$discountPrice', '$price'],
      };
      if (min !== null) priceConditions.push({ $gte: [effectivePrice, min] });
      if (max !== null) priceConditions.push({ $lte: [effectivePrice, max] });
      filter.$expr =
        priceConditions.length === 1 ? priceConditions[0] : { $and: priceConditions };
    }

    const sortOption = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .sort(sortOption)
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
 * @route   GET /api/products/:id
 * @desc    Get a single product with its category
 * @access  Public
 */
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name description'
    );
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    return successResponse(res, 'Product fetched successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/products
 * @desc    Create a product
 * @access  Private/Admin
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

    const product = await Product.create(req.body);
    await product.populate('category', 'name');

    return successResponse(res, 'Product created successfully', { product }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validateProduct(req.body, true);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const product = await Product.findById(req.params.id);
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
      'rating',
      'numReviews',
      'isFeatured',
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
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    await product.deleteOne();
    return successResponse(res, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
