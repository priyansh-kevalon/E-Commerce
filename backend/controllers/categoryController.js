import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const CATEGORY_STATUSES = ['active', 'inactive'];
const MAX_CATEGORY_NAME_LENGTH = 80;

// Escape user input before using it inside a RegExp.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @route   GET /api/categories
 * @desc    List categories (optional ?status=active and ?withCount=true)
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const { status, withCount } = req.query;

    if (status && !CATEGORY_STATUSES.includes(status)) {
      return errorResponse(res, 'Status filter must be either active or inactive', 400);
    }

    const match = {};
    if (status) match.status = status;

    let categories;

    if (withCount === 'true') {
      categories = await Category.aggregate([
        { $match: match },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'categoryProducts',
          },
        },
        { $addFields: { productCount: { $size: '$categoryProducts' } } },
        { $project: { categoryProducts: 0, __v: 0 } },
        { $sort: { name: 1 } },
      ]);
    } else {
      categories = await Category.find(match).sort({ name: 1 });
    }

    return successResponse(res, 'Categories fetched successfully', { categories });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/categories/:id
 * @desc    Get a single category
 * @access  Public
 */
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }
    return successResponse(res, 'Category fetched successfully', { category });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/categories
 * @desc    Create a category
 * @access  Private/Admin
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description = '', image = '', status = 'active' } = req.body;

    if (!name || !String(name).trim()) {
      return errorResponse(res, 'Category name is required', 400);
    }
    if (String(name).trim().length < 2 || String(name).trim().length > MAX_CATEGORY_NAME_LENGTH) {
      return errorResponse(res, `Category name must be between 2 and ${MAX_CATEGORY_NAME_LENGTH} characters`, 400);
    }
    if (!CATEGORY_STATUSES.includes(status)) {
      return errorResponse(res, 'Status must be either active or inactive', 400);
    }

    const existing = await Category.findOne({
      name: new RegExp(`^${escapeRegex(String(name).trim())}$`, 'i'),
    });
    if (existing) {
      return errorResponse(res, 'A category with this name already exists', 409);
    }

    const category = await Category.create({ name, description, image, status });
    return successResponse(res, 'Category created successfully', { category }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private/Admin
 */
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    const { name, description, image, status } = req.body;

    if (status !== undefined && !CATEGORY_STATUSES.includes(status)) {
      return errorResponse(res, 'Status must be either active or inactive', 400);
    }

    if (name !== undefined) {
      if (!String(name).trim() || String(name).trim().length < 2 || String(name).trim().length > MAX_CATEGORY_NAME_LENGTH) {
        return errorResponse(res, `Category name must be between 2 and ${MAX_CATEGORY_NAME_LENGTH} characters`, 400);
      }
      const duplicate = await Category.findOne({
        name: new RegExp(`^${escapeRegex(String(name).trim())}$`, 'i'),
        _id: { $ne: category._id },
      });
      if (duplicate) {
        return errorResponse(res, 'A category with this name already exists', 409);
      }
      category.name = name;
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (status !== undefined) category.status = status;

    await category.save();
    return successResponse(res, 'Category updated successfully', { category });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category (blocked while products still reference it)
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return errorResponse(
        res,
        `Cannot delete this category: ${productCount} product(s) still use it. Move or delete them first.`,
        400
      );
    }

    await category.deleteOne();
    return successResponse(res, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
