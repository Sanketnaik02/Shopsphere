import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { placeOrder, getOrders, getOrder, cancelOrder } from '../services/order.service'

const currentUserId = (req: Request): string => {
  const userId = req.user?.id
  if (!userId) {
    throw new ApiError(401, 'Authentication required', true, 'UNAUTHENTICATED')
  }
  return userId
}

export const placeOrderCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { addressId } = req.body
  const order = await placeOrder(currentUserId(req), addressId)
  res.status(201).json({ success: true, data: { order } })
})

export const getOrdersCtrl = asyncHandler(async (req: Request, res: Response) => {
  const orders = await getOrders(currentUserId(req))
  res.status(200).json({ success: true, data: { orders } })
})

export const getOrderCtrl = asyncHandler(async (req: Request, res: Response) => {
  const order = await getOrder(currentUserId(req), req.params.id)
  res.status(200).json({ success: true, data: { order } })
})

export const cancelOrderCtrl = asyncHandler(async (req: Request, res: Response) => {
  const order = await cancelOrder(currentUserId(req), req.params.id)
  res.status(200).json({ success: true, data: { order } })
})