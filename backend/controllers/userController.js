import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { validateProfileUpdate, validatePasswordChange } from '../validators/userValidator.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @route   GET /api/users/profile
 * @desc    Get the authenticated user's profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, 'Profile fetched successfully', { user: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update the authenticated user's name and/or email
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validateProfileUpdate(req.body);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const { name, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (name !== undefined) {
      user.name = String(name).trim();
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).toLowerCase().trim();
      const duplicate = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (duplicate) {
        return errorResponse(res, 'Email is already in use', 409);
      }
      user.email = normalizedEmail;
    }

    await user.save();
    return successResponse(res, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/password
 * @desc    Change the authenticated user's password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const errors = validatePasswordChange(req.body);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users
 * @desc    List all users (optional ?search= and ?role=)
 * @access  Private/Admin
 */
export const getUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const filter = {};

    if (role) {
      if (!['customer', 'admin'].includes(role)) {
        return errorResponse(res, 'Role filter must be either customer or admin', 400);
      }
      filter.role = role;
    }

    if (search && String(search).trim()) {
      const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    return successResponse(res, 'Users fetched successfully', { users });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user
 * @access  Private/Admin
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, 'User fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user's role, active state or name
 * @access  Private/Admin
 */
export const updateUser = async (req, res, next) => {
  try {
    const { role, isActive, name } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const isSelf = user._id.equals(req.user._id);

    if (role !== undefined) {
      if (!['customer', 'admin'].includes(role)) {
        return errorResponse(res, 'Role must be either customer or admin', 400);
      }
      if (isSelf && role !== user.role) {
        return errorResponse(res, 'You cannot change your own role', 400);
      }
      user.role = role;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return errorResponse(res, 'isActive must be true or false', 400);
      }
      if (isSelf && isActive === false) {
        return errorResponse(res, 'You cannot deactivate your own account', 400);
      }
      user.isActive = isActive;
    }

    if (name !== undefined) {
      user.name = String(name).trim();
    }

    await user.save();
    return successResponse(res, 'User updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (blocked while they still have orders)
 * @access  Private/Admin
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (user._id.equals(req.user._id)) {
      return errorResponse(res, 'You cannot delete your own account', 400);
    }

    const orderCount = await Order.countDocuments({ user: user._id });
    if (orderCount > 0) {
      return errorResponse(
        res,
        `Cannot delete this user: they have ${orderCount} order(s). Deactivate the account instead.`,
        400
      );
    }

    await Cart.deleteOne({ user: user._id });
    await Wishlist.deleteOne({ user: user._id });
    await user.deleteOne();

    return successResponse(res, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};
