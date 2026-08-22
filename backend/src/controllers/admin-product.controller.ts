import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { getAdminProducts, reactivateProduct } from '../services/admin-product.service'
import { ApiError } from '../utils/ApiError'

export const getAdminProductsCtrl = asyncHandler(async (req: Request, res: Response) => {
  const searchTerm = req.query.search as string | undefined
  const categoryId = req.query.category as string | undefined
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined
  const inStock = req.query.inStock as string | undefined
  const sortBy = req.query.sortBy as string | undefined
  const sortOrder = req.query.sortOrder as string | undefined
  const page = req.query.page ? Number(req.query.page) : 1
  const limit = req.query.limit ? Number(req.query.limit) : 20

  const result = await getAdminProducts(
    searchTerm,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortOrder,
    page,
    limit,
  )
  res.status(200).json({ success: true, data: result })
})

export const reactivateProductCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await reactivateProduct(id)
  res.status(200).json({ success: true, data: { item: product } })
})