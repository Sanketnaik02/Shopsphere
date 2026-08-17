import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import {
  getWishlist,
  addItem,
  removeItem,
  clearWishlist,
} from '../services/wishlist.service'

const currentUserId = (req: Request): string => {
  const userId = req.user?.id
  if (!userId) {
    throw new ApiError(401, 'Authentication required', true, 'UNAUTHENTICATED')
  }
  return userId
}

export const getWishlistCtrl = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await getWishlist(currentUserId(req))
  res.status(200).json({ success: true, data: { wishlist } })
})

export const addItemCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.body
  const wishlist = await addItem(currentUserId(req), productId)
  res.status(201).json({ success: true, data: { wishlist } })
})

export const removeItemCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const wishlist = await removeItem(currentUserId(req), id)
  res.status(200).json({ success: true, data: { wishlist } })
})

export const clearWishlistCtrl = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await clearWishlist(currentUserId(req))
  res.status(200).json({ success: true, data: { wishlist } })
})