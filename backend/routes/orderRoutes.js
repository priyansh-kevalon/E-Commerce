import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// Every order route requires an authenticated user.
router.use(protect);

router.route('/').post(createOrder).get(admin, getOrders);

// '/myorders' must be declared before '/:id' so it is not treated as an id.
router.route('/myorders').get(getMyOrders);

router.route('/:id').get(validateObjectId(), getOrderById);
router.route('/:id/cancel').put(validateObjectId(), cancelOrder);
router.route('/:id/status').put(admin, validateObjectId(), updateOrderStatus);

export default router;
