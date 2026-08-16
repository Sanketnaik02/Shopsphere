import { z } from 'zod'

export const PRODUCT_LIST_DEFAULT_PAGE = 1
export const PRODUCT_LIST_DEFAULT_LIMIT = 10
export const PRODUCT_LIST_MAX_LIMIT = 100

export const productCreateSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, 'Name is required')
    .max(200, 'Name must be at most 200 characters'),
  slug: z
    .string({ message: 'Slug is required' })
    .min(1, 'Slug is required')
    .max(200, 'Slug must be at most 200 characters'),
  description: z.string().optional(),
  price: z
    .number({ message: 'Price is required' })
    .int('Price must be an integer')
    .min(0, 'Price must be at least 0'),
  categoryId: z
    .string({ message: 'Category ID is required' })
    .min(1, 'Category ID is required'),
  brand: z.string().optional(),
  imageUrl: z.string().optional(),
  stock: z
    .number({ message: 'Stock is required' })
    .int('Stock must be an integer')
    .min(0, 'Stock must be at least 0'),
  rating: z
    .number({ message: 'Rating is required' })
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5')
    .optional(),
})

export const productUpdateSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, 'Name is required')
    .max(200, 'Name must be at most 200 characters')
    .optional(),
  slug: z
    .string({ message: 'Slug is required' })
    .min(1, 'Slug is required')
    .max(200, 'Slug must be at most 200 characters')
    .optional(),
  description: z.string().optional(),
  price: z
    .number({ message: 'Price is required' })
    .int('Price must be an integer')
    .min(0, 'Price must be at least 0')
    .optional(),
  categoryId: z
    .string({ message: 'Category ID is required' })
    .min(1, 'Category ID is required')
    .optional(),
  brand: z.string().optional(),
  imageUrl: z.string().optional(),
  stock: z
    .number({ message: 'Stock is required' })
    .int('Stock must be an integer')
    .min(0, 'Stock must be at least 0')
    .optional(),
  rating: z
    .number({ message: 'Rating is required' })
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5')
    .optional(),
}).refine(
  (data) => data.name || data.slug || data.price !== undefined || data.stock !== undefined || data.rating !== undefined || data.categoryId !== undefined,
  { message: 'At least one field must be provided for update' }
)