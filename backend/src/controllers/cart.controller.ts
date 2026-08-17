import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from '../services/cart.service'

const currentUserId = (req: Request): string => {
  const userId = req.user?.id
  if (!userId) {
    throw new ApiError(401, 'Authentication required', true, 'UNAUTHENTICATED')
  }
  return userId
}

export const getCartCtrl = asyncHandler(async (req: Request, res: Response) => {
  const cart = await getCart(currentUserId(req))
  res.status(200).json({ success: true, data: { cart } })
})

export const addItemCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body
  const cart = await addItem(currentUserId(req), productId, quantity)
  res.status(201).json({ success: true, data: { cart } })
})

export const updateItemCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { quantity } = req.body
  const cart = await updateItem(currentUserId(req), id, quantity)
  res.status(200).json({ success: true, data: { cart } })
})

export const removeItemCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const cart = await removeItem(currentUserId(req), id)
  res.status(200).json({ success: true, data: { cart } })
})

export const clearCartCtrl = asyncHandler(async (req: Request, res: Response) => {
  const cart = await clearCart(currentUserId(req))
  res.status(200).json({ success: true, data: { cart } })
})