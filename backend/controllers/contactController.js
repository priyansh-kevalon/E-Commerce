import ContactMessage from '../models/ContactMessage.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { validateContact } from '../validators/contactValidator.js';

const CONTACT_STATUSES = ['new', 'read', 'replied'];

// Escape user input before using it inside a RegExp.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @route   POST /api/contact
 * @desc    Submit a contact form message
 * @access  Public
 */
export const createContactMessage = async (req, res, next) => {
  try {
    const errors = validateContact(req.body);
    if (errors.length) {
      return errorResponse(res, errors[0], 400, errors);
    }

    const { name, email, phone, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone !== undefined && phone !== null ? String(phone).trim() : '',
      subject: subject && String(subject).trim() ? String(subject).trim() : 'General enquiry',
      message: String(message).trim(),
    });

    return successResponse(res, 'Message sent successfully', { contactMessage }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/contact
 * @desc    List contact messages (optional ?status=, ?search=, ?page=, ?limit=)
 * @access  Private/Admin
 */
export const getContactMessages = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    if (status && !CONTACT_STATUSES.includes(status)) {
      return errorResponse(res, 'Status filter must be one of: new, read, replied', 400);
    }

    const filter = {};
    if (status) filter.status = status;

    if (search && String(search).trim()) {
      const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { subject: regex }, { message: regex }];
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * pageSize;

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      ContactMessage.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return successResponse(res, 'Contact messages fetched successfully', {
      messages,
      pagination: {
        page: pageNumber,
        totalPages,
        total,
        hasPrevPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/contact/:id
 * @desc    Get a single contact message
 * @access  Private/Admin
 */
export const getContactMessage = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.findById(req.params.id);
    if (!contactMessage) {
      return errorResponse(res, 'Contact message not found', 404);
    }
    return successResponse(res, 'Contact message fetched successfully', { contactMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/contact/:id/status
 * @desc    Update the handling status of a contact message
 * @access  Private/Admin
 */
export const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!CONTACT_STATUSES.includes(status)) {
      return errorResponse(res, 'Status must be one of: new, read, replied', 400);
    }

    const contactMessage = await ContactMessage.findById(req.params.id);
    if (!contactMessage) {
      return errorResponse(res, 'Contact message not found', 404);
    }

    contactMessage.status = status;
    await contactMessage.save();

    return successResponse(res, 'Contact message updated successfully', { contactMessage });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete a contact message
 * @access  Private/Admin
 */
export const deleteContactMessage = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.findById(req.params.id);
    if (!contactMessage) {
      return errorResponse(res, 'Contact message not found', 404);
    }

    await contactMessage.deleteOne();
    return successResponse(res, 'Contact message deleted successfully');
  } catch (error) {
    next(error);
  }
};