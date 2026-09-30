import Subscriber from '../models/Subscriber.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

/**
 * @route   POST /api/newsletter
 * @desc    Subscribe an email to the newsletter
 * @access  Public
 */
export const subscribe = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (isBlank(email) || !/^\S+@\S+\.\S+$/.test(email)) {
      return errorResponse(res, 'Please provide a valid email address', 400);
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
      return successResponse(res, 'You are already subscribed, welcome back!', { subscribed: true });
    }

    await Subscriber.create({ email });
    return successResponse(res, 'Subscribed successfully', { subscribed: true }, 201);
  } catch (error) {
    next(error);
  }
};

export default subscribe;