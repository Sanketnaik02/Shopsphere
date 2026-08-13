import type { Role } from '@prisma/client'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export interface JwtPayload {
  userId: string
  role: Role
}

export type PublicUser = AuthUser