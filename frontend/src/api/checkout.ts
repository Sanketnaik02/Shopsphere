import { apiRequest } from '../lib/api'
import type { CheckoutPreview } from '../types/checkout'

export async function previewCheckout(addressId: string): Promise<CheckoutPreview> {
  return apiRequest<CheckoutPreview>('/checkout/preview', {
    method: 'POST',
    body: JSON.stringify({ addressId }),
  })
}