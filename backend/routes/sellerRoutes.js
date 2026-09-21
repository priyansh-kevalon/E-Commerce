import express from 'express';
import {
  getOverview,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
} from '../controllers/sellerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { seller } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Every seller route requires a signed-in seller account.
router.use(protect, seller);

router.get('/overview', getOverview);
router.get('/products', getProducts);
router.post('/products', createProduct);
router.get('/orders', getOrders);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;