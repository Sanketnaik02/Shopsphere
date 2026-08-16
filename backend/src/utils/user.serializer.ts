import type { User } from '@prisma/client'
import type { PublicUser } from '../types/auth'

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name ?? '',
  email: user.email,
  role: user.role,
})