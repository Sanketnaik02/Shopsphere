import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { loginSchema, registerSchema } from '../validators/auth.validators'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authenticate, getMe)
router.post('/logout', (_req, res) => {
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } })
})

export default router