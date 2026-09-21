import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router
  .route('/')
  .get(optionalProtect, getProducts)
  .post(protect, admin, createProduct);

router
  .route('/:id')
  .get(validateObjectId(), optionalProtect, getProduct)
  .put(protect, admin, validateObjectId(), updateProduct)
  .delete(protect, admin, validateObjectId(), deleteProduct);

export default router;
