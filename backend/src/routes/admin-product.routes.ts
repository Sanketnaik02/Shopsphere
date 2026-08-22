import { Router } from 'express'
import { getAdminProductsCtrl, reactivateProductCtrl } from '../controllers/admin-product.controller'
import { authenticate, requireRole } from '../middleware/auth.middleware'

const router = Router()

router.use(authenticate, requireRole('ADMIN'))

router.get('/', getAdminProductsCtrl)
router.patch('/:id/reactivate', reactivateProductCtrl)

export default router