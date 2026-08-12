import { type Request, type Response } from 'express'
import { getHealthStatus } from '../services/health.service'

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json(getHealthStatus())
}
