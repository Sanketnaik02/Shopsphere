import { Router } from 'express'
import {
  listAddressesCtrl,
  getAddressCtrl,
  createAddressCtrl,
  updateAddressCtrl,
  deleteAddressCtrl,
} from '../controllers/address.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createAddressSchema, updateAddressSchema } from '../validators/address.validators'

const router = Router()

router.use(authenticate)

router.get('/', listAddressesCtrl)
router.get('/:id', getAddressCtrl)
router.post('/', validate(createAddressSchema), createAddressCtrl)
router.put('/:id', validate(updateAddressSchema), updateAddressCtrl)
router.delete('/:id', deleteAddressCtrl)

export default router