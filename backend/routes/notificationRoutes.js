import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  clearAll,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// Notifications are always per-user, so every route requires a signed-in user.
router.use(protect);

router
  .route('/')
  .get(getNotifications)
  // Order matters: '/unread' and '/read-all' must not be captured by '/:id'.
  .delete(clearAll);

router.route('/unread-count').get(getUnreadCount);
router.route('/read-all').patch(markAllAsRead);
router.route('/:id').patch(validateObjectId(), markAsRead);

export default router;
