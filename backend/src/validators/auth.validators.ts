import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z.email('A valid email is required'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
})

export const loginSchema = z.object({
  email: z.email('A valid email is required'),
  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password is required'),
})