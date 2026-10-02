import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  requestSellerAccount,
  decideSellerRequest,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// Every user route requires an authenticated user.
router.use(protect);

// Self-service profile routes must be declared before '/:id'.
router.route('/profile').get(getProfile).put(updateProfile);
router.route('/password').put(changePassword);
router.post('/seller-request', requestSellerAccount);

// Admin-only user management.
router.route('/').get(admin, getUsers);
router
  .route('/:id')
  .get(admin, validateObjectId(), getUserById)
  .put(admin, validateObjectId(), updateUser)
  .delete(admin, validateObjectId(), deleteUser);
router
  .route('/:id/seller-request')
  .patch(admin, validateObjectId(), decideSellerRequest);

export default router;
