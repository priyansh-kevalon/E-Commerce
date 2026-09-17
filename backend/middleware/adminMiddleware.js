import { errorResponse } from '../utils/responseHandler.js';

/**
 * Admin middleware.
 * Must be used after `protect`. Allows only users with role = "admin".
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 'Access denied, admin only', 403);
};

export default admin;
