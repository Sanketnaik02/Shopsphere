import type { Address } from './address'
import type { CartProduct } from './cart'

export interface CheckoutItem {
  id: string
  quantity: number
  subtotal: number
  product: CartProduct
}

export interface CheckoutPreview {
  address: Address
  cart: {
    id: string
    items: CheckoutItem[]
    totalQuantity: number
  }
  subtotal: number
  shipping: number
  total: number
}