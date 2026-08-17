export interface WishlistProduct {
  id: string
  name: string
  slug: string
  brand: string | null
  price: number
  stock: number
  imageUrl: string | null
  categoryName: string | null
  categorySlug: string | null
  rating: number | null
  isActive: boolean
}

export interface WishlistItem {
  id: string
  product: WishlistProduct
}

export interface Wishlist {
  id: string
  items: WishlistItem[]
  totalItems: number
}