import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Every cart route requires an authenticated user.
router.use(protect);

router.route('/').get(getCart).post(addToCart).delete(clearCart);

router.route('/:productId').put(updateCartItem).delete(removeCartItem);

export default router;
