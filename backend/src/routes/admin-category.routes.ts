import { Router } from 'express'
import { getAdminCategoriesCtrl, reactivateCategoryCtrl } from '../controllers/admin-category.controller'
import { authenticate, requireRole } from '../middleware/auth.middleware'

const router = Router()

router.use(authenticate, requireRole('ADMIN'))

router.get('/', getAdminCategoriesCtrl)
router.patch('/:id/reactivate', reactivateCategoryCtrl)

export default router