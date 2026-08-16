import { type NextFunction, type Request, type Response } from 'express'
import type { Role } from '@prisma/client'
import prisma from '../lib/prisma'
import { verifyAccessToken } from '../utils/jwt'
import { ApiError } from '../utils/ApiError'
import type { JwtPayload } from '../types/auth'

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required', true, 'UNAUTHENTICATED')
    }

    const token = header.slice('Bearer '.length).trim()
    if (!token) {
      throw new ApiError(401, 'Authentication required', true, 'UNAUTHENTICATED')
    }

    let payload: JwtPayload
    try {
      payload = verifyAccessToken(token)
    } catch {
      throw new ApiError(401, 'Invalid or expired token', true, 'INVALID_TOKEN')
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } }) as any
    if (!user) {
      throw new ApiError(401, 'Invalid or expired token', true, 'INVALID_TOKEN')
    }

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role }
    next()
  } catch (error) {
    next(error)
  }
}

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required', true, 'UNAUTHENTICATED'))
      return
    }

    if (!roles.includes(req.user.role)) {
      next(
        new ApiError(403, 'Forbidden: insufficient permissions', true, 'FORBIDDEN'),
      )
      return
    }

    next()
  }