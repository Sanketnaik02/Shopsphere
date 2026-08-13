import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { hashPassword, verifyPassword } from '../utils/password'
import { signAccessToken } from '../utils/jwt'
import { toPublicUser } from '../utils/user.serializer'
import { ApiError } from '../utils/ApiError'

const normalizeEmail = (email: string): string => email.trim().toLowerCase()

const isUniqueViolation = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export const registerUser = async (input: RegisterInput) => {
  const email = normalizeEmail(input.email)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new ApiError(
      409,
      'An account with this email already exists',
      true,
      'EMAIL_TAKEN',
    )
  }

  const passwordHash = await hashPassword(input.password)

  let user
  try {
    user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email,
        passwordHash,
        role: 'CUSTOMER',
      },
    })
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(
        409,
        'An account with this email already exists',
        true,
        'EMAIL_TAKEN',
      )
    }
    throw error
  }

  const token = signAccessToken({ userId: user.id, role: user.role })

  return { user: toPublicUser(user), token }
}

export const loginUser = async (input: LoginInput) => {
  const email = normalizeEmail(input.email)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new ApiError(
      401,
      'Invalid email or password',
      true,
      'INVALID_CREDENTIALS',
    )
  }

  const passwordValid = await verifyPassword(input.password, user.passwordHash)
  if (!passwordValid) {
    throw new ApiError(
      401,
      'Invalid email or password',
      true,
      'INVALID_CREDENTIALS',
    )
  }

  const token = signAccessToken({ userId: user.id, role: user.role })

  return { user: toPublicUser(user), token }
}