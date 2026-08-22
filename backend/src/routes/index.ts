import { Router } from 'express'
import healthRouter from './health.routes'
import authRouter from './auth.routes'
import categoryRouter from './category.routes'
import productRouter from './product.routes'
import cartRouter from './cart.routes'
import wishlistRouter from './wishlist.routes'
import addressRouter from './address.routes'
import checkoutRouter from './checkout.routes'
import orderRouter from './order.routes'
import adminOrderRouter from './admin-order.routes'
import adminProductRouter from './admin-product.routes'
import adminCategoryRouter from './admin-category.routes'

const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/categories', categoryRouter)
router.use('/products', productRouter)
router.use('/cart', cartRouter)
router.use('/wishlist', wishlistRouter)
router.use('/addresses', addressRouter)
router.use('/checkout', checkoutRouter)
router.use('/orders', orderRouter)
router.use('/admin/orders', adminOrderRouter)
router.use('/admin/products', adminProductRouter)
router.use('/admin/categories', adminCategoryRouter)

export default router
