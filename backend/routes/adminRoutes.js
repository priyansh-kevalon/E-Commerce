import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Every admin route requires an authenticated admin user.
router.use(protect, admin);

router.route('/stats').get(getDashboardStats);

export default router;
