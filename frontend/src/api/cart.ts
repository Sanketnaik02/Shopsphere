import { apiRequest } from '../lib/api'
import type { Cart } from '../types/cart'

interface CartEnvelope {
  cart: Cart
}

export async function getCart(): Promise<Cart> {
  const data = await apiRequest<CartEnvelope>('/cart')
  return data.cart
}

export async function addCartItem(productId: string, quantity: number): Promise<Cart> {
  const data = await apiRequest<CartEnvelope>('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })
  return data.cart
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  const data = await apiRequest<CartEnvelope>(
    `/cart/items/${encodeURIComponent(itemId)}`,
    {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    },
  )
  return data.cart
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const data = await apiRequest<CartEnvelope>(
    `/cart/items/${encodeURIComponent(itemId)}`,
    { method: 'DELETE' },
  )
  return data.cart
}

export async function clearCart(): Promise<Cart> {
  const data = await apiRequest<CartEnvelope>('/cart', { method: 'DELETE' })
  return data.cart
}