import { z } from 'zod'

export const checkoutPreviewSchema = z.object({
  addressId: z.uuid('A valid address ID is required'),
})