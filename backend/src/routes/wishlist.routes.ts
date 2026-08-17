import { Router } from 'express'
import {
  getWishlistCtrl,
  addItemCtrl,
  removeItemCtrl,
  clearWishlistCtrl,
} from '../controllers/wishlist.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { addWishlistItemSchema } from '../validators/wishlist.validators'

const router = Router()

router.use(authenticate)

router.get('/', getWishlistCtrl)
router.post('/items', validate(addWishlistItemSchema), addItemCtrl)
router.delete('/items/:id', removeItemCtrl)
router.delete('/', clearWishlistCtrl)

export default router