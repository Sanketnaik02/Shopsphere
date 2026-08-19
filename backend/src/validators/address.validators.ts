import { z } from 'zod'

const phonePattern = /^\+?[0-9]{7,15}$/
const postalCodePattern = /^[A-Za-z0-9][A-Za-z0-9-]{2,19}$/

export const createAddressSchema = z.object({
  fullName: z
    .string({ message: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(120, 'Full name must be at most 120 characters'),
  phone: z
    .string({ message: 'Phone is required' })
    .trim()
    .regex(phonePattern, 'Phone must be a valid phone number'),
  addressLine1: z
    .string({ message: 'Address line 1 is required' })
    .trim()
    .min(2, 'Address line 1 must be at least 2 characters')
    .max(255, 'Address line 1 must be at most 255 characters'),
  addressLine2: z
    .string()
    .trim()
    .max(255, 'Address line 2 must be at most 255 characters')
    .optional(),
  city: z
    .string({ message: 'City is required' })
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(120, 'City must be at most 120 characters'),
  state: z
    .string({ message: 'State is required' })
    .trim()
    .min(2, 'State must be at least 2 characters')
    .max(120, 'State must be at most 120 characters'),
  postalCode: z
    .string({ message: 'Postal code is required' })
    .trim()
    .regex(postalCodePattern, 'Postal code must be a valid postal code'),
  country: z
    .string({ message: 'Country is required' })
    .trim()
    .min(2, 'Country must be at least 2 characters')
    .max(120, 'Country must be at most 120 characters'),
  isDefault: z.boolean().optional(),
})

export const updateAddressSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(120, 'Full name must be at most 120 characters')
      .optional(),
    phone: z
      .string()
      .trim()
      .regex(phonePattern, 'Phone must be a valid phone number')
      .optional(),
    addressLine1: z
      .string()
      .trim()
      .min(2, 'Address line 1 must be at least 2 characters')
      .max(255, 'Address line 1 must be at most 255 characters')
      .optional(),
    addressLine2: z
      .string()
      .trim()
      .max(255, 'Address line 2 must be at most 255 characters')
      .nullable()
      .optional(),
    city: z
      .string()
      .trim()
      .min(2, 'City must be at least 2 characters')
      .max(120, 'City must be at most 120 characters')
      .optional(),
    state: z
      .string()
      .trim()
      .min(2, 'State must be at least 2 characters')
      .max(120, 'State must be at most 120 characters')
      .optional(),
    postalCode: z
      .string()
      .trim()
      .regex(postalCodePattern, 'Postal code must be a valid postal code')
      .optional(),
    country: z
      .string()
      .trim()
      .min(2, 'Country must be at least 2 characters')
      .max(120, 'Country must be at most 120 characters')
      .optional(),
    isDefault: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })