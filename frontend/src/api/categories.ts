import { apiRequest } from '../lib/api'
import type { Category } from '../types/category'

export async function getCategories(): Promise<Category[]> {
  const data = await apiRequest<{ items: Category[] }>('/categories')
  return data.items
}