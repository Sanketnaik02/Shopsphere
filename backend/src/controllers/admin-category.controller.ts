import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { getAdminCategories, reactivateCategory } from '../services/admin-category.service'
import { ApiError } from '../utils/ApiError'

export const getAdminCategoriesCtrl = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await getAdminCategories()
  res.status(200).json({ success: true, data: { items: categories } })
})

export const reactivateCategoryCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const category = await reactivateCategory(id)
  res.status(200).json({ success: true, data: { item: category } })
})