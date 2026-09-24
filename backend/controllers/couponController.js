import Coupon from '../models/Coupon.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const COUPON_TYPES = ['percentage', 'fixed', 'shipping'];
const CODE_REGEX = /^[A-Z0-9-_]+$/;
const MAX_CODE_LENGTH = 40;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeCode = (raw) => String(raw || '').replace(/\s+/g, '').toUpperCase();

const isUsable = (coupon) =>
  coupon.isActive &&
  (!coupon.expiresAt || new Date(coupon.expiresAt).getTime() > Date.now()) &&
  (coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit);

const validatePayload = (body) => {
  let error = null;

  const code = normalizeCode(body.code);
  if (!code || code.length < 3 || code.length > MAX_CODE_LENGTH) {
    error = `Coupon code must be between 3 and ${MAX_CODE_LENGTH} characters`;
  } else if (!CODE_REGEX.test(code)) {
    error = 'Coupon code can only contain letters, numbers, dashes and underscores';
  }

  const type = body.type || 'percentage';
  if (!COUPON_TYPES.includes(type)) {
    error = error || 'Type must be percentage, fixed or shipping';
  }

  const value = Number(body.value);
  if (body.value === undefined || body.value === null || body.value === '' || !Number.isFinite(value)) {
    error = error || 'Coupon value is required';
  } else if (value <= 0) {
    error = error || 'Coupon value must be greater than zero';
  } else if (type === 'percentage' && value > 100) {
    error = error || 'Percentage discount cannot exceed 100%';
  }

  const minOrder = body.minOrder === undefined || body.minOrder === null || body.minOrder === '' ? 0 : Number(body.minOrder);
  const usageLimit = body.usageLimit === undefined || body.usageLimit === null || body.usageLimit === '' ? 0 : Number(body.usageLimit);
  const maxDiscount = body.maxDiscount === undefined || body.maxDiscount === null || body.maxDiscount === '' ? 0 : Number(body.maxDiscount);

  if (!Number.isFinite(minOrder) || minOrder < 0) error = error || 'Minimum order value must be zero or more';
  if (!Number.isInteger(usageLimit) || usageLimit < 0) error = error || 'Usage limit must be a whole number of zero or more';
  if (!Number.isFinite(maxDiscount) || maxDiscount < 0) error = error || 'Maximum discount cap must be zero or more';

  let expiresAt = null;
  if (body.expiresAt) {
    const parsed = new Date(body.expiresAt);
    if (Number.isNaN(parsed.getTime())) {
      error = error || 'Expiry must be a valid date';
    } else {
      expiresAt = parsed;
    }
  }

  let isActive = true;
  if (body.isActive !== undefined) isActive = Boolean(body.isActive);

  return { error, payload: { code, type, value, minOrder, usageLimit, maxDiscount, expiresAt, isActive } };
};

/**
 * @route   GET /api/coupons
 * @desc    List currently usable coupons (storefront)
 * @access  Public
 */
export const getActiveCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    })
      .sort({ createdAt: -1 })
      .select('code description type value minOrder maxDiscount expiresAt');
    return successResponse(res, 'Coupons fetched successfully', { coupons });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/coupons
 * @desc    List every coupon for the admin panel
 * @access  Private/Admin
 */
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return successResponse(res, 'Coupons fetched successfully', { coupons });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/coupons
 * @desc    Create a coupon
 * @access  Private/Admin
 */
export const createCoupon = async (req, res, next) => {
  try {
    const { error, payload } = validatePayload(req.body);
    if (error) return errorResponse(res, error, 400);

    const duplicate = await Coupon.findOne({
      code: new RegExp(`^${escapeRegex(payload.code)}$`),
    });
    if (duplicate) return errorResponse(res, `Coupon code ${payload.code} already exists`, 409);

    const coupon = await Coupon.create(payload);
    return successResponse(res, 'Coupon created successfully', { coupon }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/coupons/:id
 * @desc    Update a coupon
 * @access  Private/Admin
 */
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return errorResponse(res, 'Coupon not found', 404);

    // When the code is omitted on update, keep the existing one so partial
    // updates still work. The form always sends the code; this guards the API.
    if (req.body.code === undefined || req.body.code === null || String(req.body.code).trim() === '') {
      req.body.code = coupon.code;
    }

    const { error, payload } = validatePayload(req.body);
    if (error) return errorResponse(res, error, 400);

    if (payload.usageLimit > 0 && coupon.usedCount > payload.usageLimit) {
      return errorResponse(
        res,
        `Usage limit cannot be lower than the ${coupon.usedCount} time(s) already used`,
        400
      );
    }

    const duplicate = await Coupon.findOne({
      code: new RegExp(`^${escapeRegex(payload.code)}$`),
      _id: { $ne: coupon._id },
    });
    if (duplicate) return errorResponse(res, `Coupon code ${payload.code} already exists`, 409);

    coupon.code = payload.code;
    coupon.type = payload.type;
    coupon.value = payload.value;
    coupon.minOrder = payload.minOrder;
    coupon.usageLimit = payload.usageLimit;
    coupon.maxDiscount = payload.type === 'percentage' ? payload.maxDiscount : 0;
    coupon.expiresAt = payload.expiresAt;
    coupon.isActive = payload.isActive;
    if (req.body.description !== undefined) coupon.description = String(req.body.description).trim();

    await coupon.save();
    return successResponse(res, 'Coupon updated successfully', { coupon });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/coupons/:id
 * @desc    Delete a coupon
 * @access  Private/Admin
 */
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return errorResponse(res, 'Coupon not found', 404);
    await coupon.deleteOne();
    return successResponse(res, 'Coupon deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/coupons/validate
 * @desc    Validate a coupon code against an order total and return the discount
 * @access  Public
 */
export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const orderTotal = Number(req.body.orderTotal) || 0;

    if (!code) return successResponse(res, 'Coupon validation result', { valid: false, message: 'Enter a coupon code' });

    const coupon = await Coupon.findOne({ code: normalizeCode(code) });
    if (!coupon) return successResponse(res, 'Coupon validation result', { valid: false, message: 'Invalid coupon code' });

    if (!coupon.isActive) {
      return successResponse(res, 'Coupon validation result', { valid: false, message: 'This coupon is no longer active' });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return successResponse(res, 'Coupon validation result', { valid: false, message: 'This coupon has expired' });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return successResponse(res, 'Coupon validation result', { valid: false, message: 'This coupon has reached its usage limit' });
    }
    if (orderTotal < coupon.minOrder) {
      return successResponse(res, 'Coupon validation result', {
        valid: false,
        message: `Add ${Math.ceil(coupon.minOrder - orderTotal)} more to use this coupon`,
      });
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, orderTotal);
    } else {
      discount = Math.min(coupon.value, orderTotal);
    }

    return successResponse(res, 'Coupon validation result', {
      valid: true,
      discount: Math.round(discount * 100) / 100,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        description: coupon.description,
      },
    });
  } catch (error) {
    next(error);
  }
};