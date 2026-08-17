import { Router } from 'express'
import {
  getCartCtrl,
  addItemCtrl,
  updateItemCtrl,
  removeItemCtrl,
  clearCartCtrl,
} from '../controllers/cart.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { addCartItemSchema, updateCartItemSchema } from '../validators/cart.validators'

const router = Router()

router.use(authenticate)

router.get('/', getCartCtrl)
router.post('/items', validate(addCartItemSchema), addItemCtrl)
router.put('/items/:id', validate(updateCartItemSchema), updateItemCtrl)
router.delete('/items/:id', removeItemCtrl)
router.delete('/', clearCartCtrl)

export default router