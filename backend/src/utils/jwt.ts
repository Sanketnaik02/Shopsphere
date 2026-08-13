import jwt from 'jsonwebtoken'
import env from '../config/env'
import type { JwtPayload } from '../types/auth'

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  })

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwtSecret) as JwtPayload