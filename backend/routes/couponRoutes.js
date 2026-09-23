import express from 'express';
import {
  getActiveCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/', getActiveCoupons);
router.post('/validate', validateCoupon);

router.post('/', protect, admin, createCoupon);

router
  .route('/:id')
  .put(protect, admin, validateObjectId(), updateCoupon)
  .delete(protect, admin, validateObjectId(), deleteCoupon);

export default router;