import { Router } from 'express'
import {
  getAdminOrdersCtrl,
  getAdminOrderByIdCtrl,
  updateAdminOrderStatusCtrl,
} from '../controllers/admin-order.controller'
import { authenticate, requireRole } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { adminOrderStatusUpdateSchema } from '../validators/admin-order.validators'

const router = Router()

router.use(authenticate, requireRole('ADMIN'))

router.get('/', getAdminOrdersCtrl)
router.get('/:id', getAdminOrderByIdCtrl)
router.patch('/:id/status', validate(adminOrderStatusUpdateSchema), updateAdminOrderStatusCtrl)

export default router