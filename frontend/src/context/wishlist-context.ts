import { createContext } from 'react'
import type { Wishlist } from '../types/wishlist'

export interface WishlistContextValue {
  wishlist: Wishlist | null
  loading: boolean
  error: boolean
  refreshWishlist: () => Promise<void>
  addItem: (productId: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (productId: string) => boolean
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)