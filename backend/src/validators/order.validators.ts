import { z } from 'zod'

export const placeOrderSchema = z.object({
  addressId: z.uuid('A valid address ID is required'),
})