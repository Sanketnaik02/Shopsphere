import { apiRequest } from '../lib/api'
import type { Wishlist } from '../types/wishlist'

interface WishlistEnvelope {
  wishlist: Wishlist
}

export async function getWishlist(): Promise<Wishlist> {
  const data = await apiRequest<WishlistEnvelope>('/wishlist')
  return data.wishlist
}

export async function addWishlistItem(productId: string): Promise<Wishlist> {
  const data = await apiRequest<WishlistEnvelope>('/wishlist/items', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })
  return data.wishlist
}

export async function removeWishlistItem(itemId: string): Promise<Wishlist> {
  const data = await apiRequest<WishlistEnvelope>(
    `/wishlist/items/${encodeURIComponent(itemId)}`,
    { method: 'DELETE' },
  )
  return data.wishlist
}

export async function clearWishlist(): Promise<Wishlist> {
  const data = await apiRequest<WishlistEnvelope>('/wishlist', { method: 'DELETE' })
  return data.wishlist
}