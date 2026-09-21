import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/responseHandler.js';

/**
 * Protect middleware.
 * Verifies the Bearer JWT and attaches the matching user to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Not authorized, no token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'Not authorized, user no longer exists', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been disabled', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized, token is invalid or expired', 401);
  }
};

/**
 * Optional protection.
 * Like `protect`, but silently continues when no/invalid token is present so
 * public routes can render differently for signed-in users.
 */
export const optionalProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user && user.isActive) {
      req.user = user;
    }

    return next();
  } catch (error) {
    return next();
  }
};

export default protect;
