/**
 * Consistent API response helpers.
 *
 * Success: { success: true,  message, data }
 * Error:   { success: false, message, errors? }
 */

export const successResponse = (res, message, data = null, statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};
