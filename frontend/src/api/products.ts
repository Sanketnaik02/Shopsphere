import { apiRequest } from '../lib/api'
import type { Product, ProductListResponse } from '../types/product'

export interface GetProductsParams {
  page?: number
  limit?: number
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<ProductListResponse> {
  const { page = 1, limit = 10 } = params
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })
  return apiRequest<ProductListResponse>(`/products?${query.toString()}`)
}

export async function getProductById(id: string): Promise<Product> {
  const data = await apiRequest<{ item: Product }>(
    `/products/${encodeURIComponent(id)}`,
  )
  return data.item
}