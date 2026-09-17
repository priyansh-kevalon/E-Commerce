import mongoose from 'mongoose';
import { errorResponse } from '../utils/responseHandler.js';

/**
 * Route middleware that rejects malformed MongoDB ObjectId params with a clean
 * 400 instead of letting Mongoose throw a CastError (which would surface as a
 * misleading 404).
 *
 * Usage: router.route('/:id').get(validateObjectId(), handler)
 */
export const validateObjectId =
  (param = 'id') =>
  (req, res, next) => {
    const value = req.params[param];
    if (!value || !mongoose.Types.ObjectId.isValid(value)) {
      return errorResponse(res, 'Invalid resource id', 400);
    }
    return next();
  };

export default validateObjectId;
