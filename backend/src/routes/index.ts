import { Router } from 'express'
import healthRouter from './health.routes'
import authRouter from './auth.routes'
import categoryRouter from './category.routes'
import productRouter from './product.routes'

const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/categories', categoryRouter)
router.use('/products', productRouter)

export default router
