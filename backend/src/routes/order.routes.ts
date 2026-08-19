import { Router } from 'express'
import {
  placeOrderCtrl,
  getOrdersCtrl,
  getOrderCtrl,
  cancelOrderCtrl,
} from '../controllers/order.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { placeOrderSchema } from '../validators/order.validators'

const router = Router()

router.use(authenticate)

router.post('/', validate(placeOrderSchema), placeOrderCtrl)
router.get('/', getOrdersCtrl)
router.get('/:id', getOrderCtrl)
router.post('/:id/cancel', cancelOrderCtrl)

export default router