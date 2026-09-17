import { errorResponse } from '../utils/responseHandler.js';

/**
 * 404 handler for unmatched routes.
 * Forwards a 404 error to the central error handler.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Reduce Mongoose validation details to { field: message } so raw input values
// are never echoed back to the client.
const sanitizeValidationErrors = (errors) => {
  if (!errors) return null;
  if (Array.isArray(errors)) return errors;
  return Object.entries(errors).reduce((acc, [field, detail]) => {
    acc[field] = detail?.message || String(detail);
    return acc;
  }, {});
};

/**
 * Central error handler.
 * Converts known Mongoose/JWT/body-parser errors into clean, consistent JSON.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Invalid MongoDB ObjectId / cast failure.
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose schema validation.
  if (err.name === 'ValidationError') {
    errors = sanitizeValidationErrors(err.errors);
    message = errors ? Object.values(errors).join(', ') : 'Validation failed';
    statusCode = 400;
  }

  // Duplicate key (e.g. email already exists).
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field} already exists`;
    statusCode = 409;
  }

  // Invalid / expired JWT.
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired, please log in again';
    statusCode = 401;
  }

  // Malformed request body.
  if (err.type === 'entity.parse.failed') {
    message = 'Invalid JSON payload';
    statusCode = 400;
  }

  // Request body too large.
  if (err.type === 'entity.too.large') {
    message = 'Payload too large';
    statusCode = 413;
  }

  // Unexpected failures: log for debugging but never leak internals.
  if (statusCode >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
    message = 'Internal server error';
    errors = null;
  }

  return errorResponse(res, message, statusCode, errors);
};

export default errorHandler;
