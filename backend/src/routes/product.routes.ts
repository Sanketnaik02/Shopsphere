import { Router } from 'express'
import {
  listProducts,
  getProduct,
  createProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} from '../controllers/product.controller'
import { authenticate, requireRole } from '../middleware/auth.middleware'

const router = Router()

// Customer routes - no auth required
router.get('/', listProducts)
router.get('/:id', getProduct)

// Admin routes - auth + role required
router.post('/', authenticate, requireRole('ADMIN'), createProductCtrl)
router.put('/:id', authenticate, requireRole('ADMIN'), updateProductCtrl)
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteProductCtrl)

export default router