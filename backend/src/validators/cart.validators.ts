import { z } from 'zod'

export const addCartItemSchema = z.object({
  productId: z.uuid('A valid product ID is required'),
  quantity: z
    .number({ message: 'Quantity is required' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
})

export const updateCartItemSchema = z.object({
  quantity: z
    .number({ message: 'Quantity is required' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
})