import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { getCategories, getCategoryById, createCategory, updateCategory, softDeleteCategory } from '../services/category.service'
import { categoryCreateSchema, categoryUpdateSchema } from '../validators/category.validators'
import { ApiError } from '../utils/ApiError'

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await getCategories()
  res.status(200).json({ success: true, data: { items: categories } })
})

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const category = await getCategoryById(id)
  if (!category) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Category not found',
      errorCode: 'CATEGORY_NOT_FOUND',
    })
  }
  res.status(200).json({ success: true, data: { item: category } })
})

export const createCategoryCtrl = asyncHandler(async (req: Request, res: Response) => {
  const validated = categoryCreateSchema.safeParse(req.body)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: firstIssue.message,
      errorCode: 'VALIDATION_ERROR',
    })
  }

  const { name, slug, description: desc = null } = validated.data
  const category = await createCategory(name, slug, desc)
  res.status(201).json({ success: true, data: { item: category } })
})

export const updateCategoryCtrl = asyncHandler(async (req: Request, res: Response) => {
  const validated = categoryUpdateSchema.safeParse(req.body)
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
  const { name, slug, description, isActive } = validated.data
  const category = await updateCategory(id, name, slug, description, isActive)
  res.status(200).json({ success: true, data: { item: category } })
})

export const deleteCategoryCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const category = await softDeleteCategory(id)
  res.status(200).json({ success: true, data: { item: category } })
})