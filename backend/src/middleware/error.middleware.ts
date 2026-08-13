import { type NextFunction, type Request, type Response } from 'express'
import { ApiError } from '../utils/ApiError'
import env from '../config/env'

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isApiError = err instanceof ApiError
  const statusCode = isApiError ? err.statusCode : 500
  const message = isApiError ? err.message : 'Internal server error'
  const errorCode = isApiError ? err.errorCode : 'INTERNAL_ERROR'

  if (env.nodeEnv !== 'test') {
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorCode,
  })
}
