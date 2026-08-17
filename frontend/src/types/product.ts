export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  brand: string | null
  imageUrl: string | null
  stock: number
  rating: number | null
  isActive: boolean
  categoryName: string | null
  categorySlug: string | null
}

export interface Pagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ProductListResponse {
  items: Product[]
  pagination: Pagination
}