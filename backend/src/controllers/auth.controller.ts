import { type Request, type Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { loginUser, registerUser } from '../services/auth.service'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const result = await registerUser({ name, email, password })
  res.status(201).json({ success: true, data: result })
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await loginUser({ email, password })
  res.status(200).json({ success: true, data: result })
})

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user
  if (!user) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Authentication required',
      errorCode: 'UNAUTHENTICATED',
    })
    return
  }

  res.status(200).json({ success: true, data: { user } })
})