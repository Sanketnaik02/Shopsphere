import { z } from 'zod'

export const categoryCreateSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  slug: z
    .string({ message: 'Slug is required' })
    .min(1, 'Slug is required')
    .max(100, 'Slug must be at most 100 characters'),
  description: z.string().optional(),
})

export const categoryUpdateSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  slug: z
    .string({ message: 'Slug is required' })
    .min(1, 'Slug is required')
    .max(100, 'Slug must be at most 100 characters')
    .optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
}).refine(
  (data) => data.name || data.slug,
  { message: 'At least one of name or slug must be provided' }
)