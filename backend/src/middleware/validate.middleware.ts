import { type NextFunction, type Request, type Response } from 'express'
import { type ZodType } from 'zod'
import { ApiError } from '../utils/ApiError'

export const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const firstIssue = result.error.issues[0]
      next(
        new ApiError(
          400,
          firstIssue?.message ?? 'Validation failed',
          true,
          'VALIDATION_ERROR',
        ),
      )
      return
    }

    req.body = result.data
    next()
  }