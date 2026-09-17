import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Every wishlist route requires an authenticated user.
router.use(protect);

router.route('/').get(getWishlist);

router.route('/:productId').post(addToWishlist).delete(removeFromWishlist);

export default router;
