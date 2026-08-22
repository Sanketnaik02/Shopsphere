import { apiRequest } from '../lib/api'
import type { Product, ProductListResponse } from '../types/product'

export interface GetAdminProductsParams {
  page?: number
  limit?: number
}

export interface CreateProductInput {
  name: string
  slug: string
  description?: string
  price: number
  categoryId: string
  brand?: string
  imageUrl?: string
  stock: number
  rating?: number
}

export interface UpdateProductInput {
  name?: string
  slug?: string
  description?: string | null
  price?: number
  categoryId?: string
  brand?: string
  imageUrl?: string
  stock?: number
  rating?: number
}

export async function getAdminProducts(
  params: GetAdminProductsParams = {},
): Promise<ProductListResponse> {
  const { page = 1, limit = 20 } = params
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })
  return apiRequest<ProductListResponse>(`/products?${query.toString()}`)
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const data = await apiRequest<{ item: Product }>('/products', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return data.item
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const data = await apiRequest<{ item: Product }>(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return data.item
}

export async function deleteProduct(id: string): Promise<Product> {
  const data = await apiRequest<{ item: Product }>(`/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return data.item
}