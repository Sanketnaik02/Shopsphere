import { Router } from 'express'
import {
  listCategories,
  getCategory,
  createCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} from '../controllers/category.controller'
import { authenticate, requireRole } from '../middleware/auth.middleware'

const router = Router()

// Customer routes - no auth required
router.get('/', listCategories)
router.get('/:id', getCategory)

// Admin routes - auth + role required
router.post('/', authenticate, requireRole('ADMIN'), createCategoryCtrl)
router.put('/:id', authenticate, requireRole('ADMIN'), updateCategoryCtrl)
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteCategoryCtrl)

export default router