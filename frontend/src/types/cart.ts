export interface CartProduct {
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

export interface CartItem {
  id: string
  quantity: number
  product: CartProduct
  subtotal: number
}

export interface Cart {
  id: string
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
}