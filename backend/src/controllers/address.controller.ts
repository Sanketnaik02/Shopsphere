import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import {
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../services/address.service'

const currentUserId = (req: Request): string => {
  const userId = req.user?.id
  if (!userId) {
    throw new ApiError(401, 'Authentication required', true, 'UNAUTHENTICATED')
  }
  return userId
}

export const listAddressesCtrl = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await listAddresses(currentUserId(req))
  res.status(200).json({ success: true, data: { addresses } })
})

export const getAddressCtrl = asyncHandler(async (req: Request, res: Response) => {
  const address = await getAddress(currentUserId(req), req.params.id)
  res.status(200).json({ success: true, data: { address } })
})

export const createAddressCtrl = asyncHandler(async (req: Request, res: Response) => {
  const address = await createAddress(currentUserId(req), req.body)
  res.status(201).json({ success: true, data: { address } })
})

export const updateAddressCtrl = asyncHandler(async (req: Request, res: Response) => {
  const address = await updateAddress(currentUserId(req), req.params.id, req.body)
  res.status(200).json({ success: true, data: { address } })
})

export const deleteAddressCtrl = asyncHandler(async (req: Request, res: Response) => {
  await deleteAddress(currentUserId(req), req.params.id)
  res.status(200).json({ success: true, data: { deleted: true } })
})