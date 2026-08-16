import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { getActiveProducts, getProductById, createProduct, updateProduct, softDeleteProduct } from '../services/product.service'
import { productCreateSchema, productUpdateSchema } from '../validators/product.validators'
import { ApiError } from '../utils/ApiError'

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const searchTerm = req.query.search as string | undefined
  const categoryId = req.query.category as string | undefined
  const minPrice = req.query.minPrice
    ? Number(req.query.minPrice)
    : undefined
  const maxPrice = req.query.maxPrice
    ? Number(req.query.maxPrice)
    : undefined
  const inStock = req.query.inStock as string | undefined
  const sortBy = req.query.sortBy as string | undefined
  const sortOrder = req.query.sortOrder as string | undefined

  const products = await getActiveProducts(
    searchTerm,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortOrder
  )
  res.status(200).json({ success: true, data: { items: products } })
})

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await getProductById(id)
  if (!product) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Product not found',
      errorCode: 'PRODUCT_NOT_FOUND',
    })
  }
  res.status(200).json({ success: true, data: { item: product } })
})

export const createProductCtrl = asyncHandler(async (req: Request, res: Response) => {
  const validated = productCreateSchema.safeParse(req.body)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: firstIssue.message,
      errorCode: 'VALIDATION_ERROR',
    })
  }

  const { name, slug, description: desc, price, categoryId, brand: brandRaw, imageUrl: imageUrlRaw, stock, rating: ratingRaw } = validated.data
  const product = await createProduct(name, slug, desc ?? null, price, categoryId, brandRaw ?? null, imageUrlRaw ?? null, stock, ratingRaw ?? null)
  res.status(201).json({ success: true, data: { item: product } })
})

export const updateProductCtrl = asyncHandler(async (req: Request, res: Response) => {
  const validated = productUpdateSchema.safeParse(req.body)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: firstIssue.message,
      errorCode: 'VALIDATION_ERROR',
    })
  }

  const { id } = req.params
  const { name, slug, description, price, categoryId, brand, imageUrl, stock, rating } = validated.data
  const product = await updateProduct(id, name, slug, description, price, categoryId, brand, imageUrl, stock, rating)
  res.status(200).json({ success: true, data: { item: product } })
})

export const deleteProductCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await softDeleteProduct(id)
  res.status(200).json({ success: true, data: { item: product } })
})