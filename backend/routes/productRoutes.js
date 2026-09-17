import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router
  .route('/:id')
  .get(validateObjectId(), getProduct)
  .put(protect, admin, validateObjectId(), updateProduct)
  .delete(protect, admin, validateObjectId(), deleteProduct);

export default router;
