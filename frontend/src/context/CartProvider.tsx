import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CartContext } from './cart-context'
import { useAuth } from './use-auth'
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from '../api/cart'
import type { Cart } from '../types/cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null)
      setLoading(false)
      setError(false)
      return
    }
    setLoading(true)
    setError(false)
    try {
      const data = await getCart()
      setCart(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refreshCart()
  }, [refreshCart])

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    const updated = await addCartItem(productId, quantity)
    setCart(updated)
    setError(false)
  }, [])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    const updated = await updateCartItem(itemId, quantity)
    setCart(updated)
    setError(false)
  }, [])

  const removeItem = useCallback(async (itemId: string) => {
    const updated = await removeCartItem(itemId)
    setCart(updated)
    setError(false)
  }, [])

  const clearCart = useCallback(async () => {
    const updated = await clearCartApi()
    setCart(updated)
    setError(false)
  }, [])

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [cart, loading, error, refreshCart, addToCart, updateQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}