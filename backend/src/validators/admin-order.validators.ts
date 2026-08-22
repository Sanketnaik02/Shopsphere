import { z } from 'zod'

export const adminOrderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
    message: 'Status must be one of: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED',
  }),
})