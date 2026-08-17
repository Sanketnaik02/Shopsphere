import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { WishlistContext } from './wishlist-context'
import { useAuth } from './use-auth'
import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist as clearWishlistApi,
} from '../api/wishlist'
import type { Wishlist } from '../types/wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(null)
      setLoading(false)
      setError(false)
      return
    }
    setLoading(true)
    setError(false)
    try {
      const data = await getWishlist()
      setWishlist(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refreshWishlist()
  }, [refreshWishlist])

  const addItem = useCallback(async (productId: string) => {
    const updated = await addWishlistItem(productId)
    setWishlist(updated)
    setError(false)
  }, [])

  const removeItem = useCallback(async (itemId: string) => {
    const updated = await removeWishlistItem(itemId)
    setWishlist(updated)
    setError(false)
  }, [])

  const clearWishlist = useCallback(async () => {
    const updated = await clearWishlistApi()
    setWishlist(updated)
    setError(false)
  }, [])

  const isInWishlist = useCallback(
    (productId: string): boolean =>
      wishlist?.items.some((item) => item.product.id === productId) ?? false,
    [wishlist],
  )

  const value = useMemo(
    () => ({
      wishlist,
      loading,
      error,
      refreshWishlist,
      addItem,
      removeItem,
      clearWishlist,
      isInWishlist,
    }),
    [
      wishlist,
      loading,
      error,
      refreshWishlist,
      addItem,
      removeItem,
      clearWishlist,
      isInWishlist,
    ],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}