import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { getCheckoutPreview } from '../services/checkout.service'

const currentUserId = (req: Request): string => {
  const userId = req.user?.id
  if (!userId) {
    throw new ApiError(401, 'Authentication required', true, 'UNAUTHENTICATED')
  }
  return userId
}

export const checkoutPreviewCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { addressId } = req.body
  const preview = await getCheckoutPreview(currentUserId(req), addressId)
  res.status(200).json({ success: true, data: preview })
})