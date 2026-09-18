import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// Submitting a contact form is public.
router.route('/').post(createContactMessage);

// Everything below requires an authenticated admin user.
router.use(protect, admin);

router.route('/').get(getContactMessages);

router
  .route('/:id')
  .get(validateObjectId(), getContactMessage)
  .delete(validateObjectId(), deleteContactMessage);

router.route('/:id/status').patch(validateObjectId(), updateContactMessageStatus);

export default router;