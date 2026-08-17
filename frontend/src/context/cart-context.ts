import { createContext } from 'react'
import type { Cart } from '../types/cart'

export interface CartContextValue {
  cart: Cart | null
  loading: boolean
  error: boolean
  refreshCart: () => Promise<void>
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)