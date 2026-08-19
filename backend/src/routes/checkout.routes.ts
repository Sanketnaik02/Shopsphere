import { Router } from 'express'
import { checkoutPreviewCtrl } from '../controllers/checkout.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { checkoutPreviewSchema } from '../validators/checkout.validators'

const router = Router()

router.use(authenticate)

router.post('/preview', validate(checkoutPreviewSchema), checkoutPreviewCtrl)

export default router