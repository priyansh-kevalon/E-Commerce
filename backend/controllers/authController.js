import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';

// Shape a user for API responses (never includes password).
const buildAuthPayload = (user) => ({
  token: generateToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  },
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer (or seller) account. Regular users can
 *          never self-assign the admin role.
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const errors = validateRegister(req.body);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const { name, email, password } = req.body;
    const role = req.body.role === 'seller' ? 'seller' : 'customer';

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return errorResponse(res, 'Email is already registered', 409);
    }

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: buildAuthPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and return a JWT
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been disabled', 403);
    }

    return successResponse(res, 'Login successful', buildAuthPayload(user));
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get the currently authenticated user
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    return successResponse(res, 'Authenticated user fetched', { user: req.user });
  } catch (error) {
    next(error);
  }
};
