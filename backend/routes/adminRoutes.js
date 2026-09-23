import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { getCoupons } from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Every admin route requires an authenticated admin user.
router.use(protect, admin);

router.route('/stats').get(getDashboardStats);
router.route('/coupons').get(getCoupons);

export default router;
