import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router
  .route('/:id')
  .get(validateObjectId(), getCategory)
  .put(protect, admin, validateObjectId(), updateCategory)
  .delete(protect, admin, validateObjectId(), deleteCategory);

export default router;
