import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { validateProfileUpdate, validatePasswordChange } from '../validators/userValidator.js';
import { createNotification, notifyRole } from './notificationController.js';

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
    // Invalidate every previously issued token so a compromised session is
    // dead the moment the password rotates.
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    return successResponse(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/seller-request
 * @desc    Apply to become a seller. Puts the account into a pending state and
 *          prompts the admins to review it.
 * @access  Private
 */
export const requestSellerAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (user.role === 'seller') {
      return errorResponse(res, 'You are already a seller', 400);
    }

    if (user.role === 'admin') {
      return errorResponse(res, 'Admin accounts cannot request seller access', 400);
    }

    if (user.sellerStatus === 'pending') {
      return errorResponse(res, 'Your request is already being reviewed', 409);
    }

    user.sellerStatus = 'pending';
    user.sellerRequestedAt = new Date();
    user.sellerDecidedAt = null;
    user.sellerNote = '';
    await user.save();

    // Admins review the application; sellers are told so the marketplace team
    // knows a new seller is onboarding.
    notifyRole({
      roles: ['admin', 'seller'],
      exclude: req.user._id,
      type: 'seller_request',
      title: 'Seller application received',
      body: `${user.name} (${user.email}) applied to become a seller.`,
      link: '/admin/users#seller-requests',
      // Lets the admin bell approve or reject this application in place.
      meta: { userId: String(user._id), name: user.name, email: user.email },
    });

    return successResponse(
      res,
      'Application submitted. An admin will review it shortly.',
      { sellerStatus: user.sellerStatus, sellerRequestedAt: user.sellerRequestedAt },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/users/:id/seller-request
 * @desc    Approve or reject a seller application. Approving flips the account
 *          to the seller role and tells the applicant either way.
 * @access  Private/Admin
 */
export const decideSellerRequest = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return errorResponse(res, 'Status must be either approved or rejected', 400);
    }

    const note = String(req.body.note ?? '').trim();
    if (note.length > 300) {
      return errorResponse(res, 'Note cannot exceed 300 characters', 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (user.role === 'admin') {
      return errorResponse(res, 'Admin accounts cannot be converted to sellers', 400);
    }

    if (user.sellerStatus !== 'pending') {
      return errorResponse(res, 'This account has no pending seller request', 400);
    }

    user.sellerStatus = status;
    user.sellerDecidedAt = new Date();
    user.sellerNote = note;

    // Approval is what actually grants seller access.
    if (status === 'approved') {
      user.role = 'seller';
    }

    await user.save();

    createNotification({
      user: user._id,
      type: status === 'approved' ? 'seller_approved' : 'seller_rejected',
      title: status === 'approved' ? 'Your seller account is approved' : 'Seller application rejected',
      body:
        status === 'approved'
          ? 'You can now list products and manage orders from your seller dashboard.'
          : note
            ? `Reason: ${note}`
            : 'Your application was not approved. You may apply again later.',
      link: status === 'approved' ? '/seller' : '/profile',
    });

    // Retire the original request alert for every admin. The application is no
    // longer pending, so leaving it unread would show a decision that now fails
    // with "no pending seller request". meta.userId is stored as a string, so
    // match both representations.
    await Notification.updateMany(
      {
        type: 'seller_request',
        'meta.userId': { $in: [String(user._id), user._id] },
        read: false,
      },
      { $set: { read: true, readAt: new Date() } }
    );

    return successResponse(res, `Seller application ${status}`, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus,
        sellerDecidedAt: user.sellerDecidedAt,
        sellerNote: user.sellerNote,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users
 * @desc    List all users (optional ?search=, ?role= and ?sellerStatus=)
 * @access  Private/Admin
 */
export const getUsers = async (req, res, next) => {
  try {
    const { search, role, sellerStatus } = req.query;
    const filter = {};

    if (role) {
      if (!['customer', 'seller', 'admin'].includes(role)) {
        return errorResponse(res, 'Role filter must be either customer, seller or admin', 400);
      }
      filter.role = role;
    }

    // Lets the admin users page list just the applications awaiting review.
    if (sellerStatus) {
      if (!['none', 'pending', 'approved', 'rejected'].includes(sellerStatus)) {
        return errorResponse(res, 'Invalid seller status filter', 400);
      }
      filter.sellerStatus = sellerStatus;
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
      if (!['customer', 'seller', 'admin'].includes(role)) {
        return errorResponse(res, 'Role must be either customer, seller or admin', 400);
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
