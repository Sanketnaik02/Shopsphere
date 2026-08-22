import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  type AdminOrderListResponse,
  type AdminOrderResponse,
} from '../services/admin-order.service'
import { adminOrderStatusUpdateSchema } from '../validators/admin-order.validators'

export const getAdminOrdersCtrl = asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1
  const limit = req.query.limit ? Number(req.query.limit) : 20

  const result = await getAdminOrders(page, limit)
  res.status(200).json({ success: true, data: result })
})

export const getAdminOrderByIdCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const order = await getAdminOrderById(id)
  res.status(200).json({ success: true, data: { item: order } })
})

export const updateAdminOrderStatusCtrl = asyncHandler(async (req: Request, res: Response) => {
  const validated = adminOrderStatusUpdateSchema.safeParse(req.body)
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
  const { status } = validated.data

  const order = await updateAdminOrderStatus(id, status)
  res.status(200).json({ success: true, data: { item: order } })
})