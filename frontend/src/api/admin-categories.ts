import { apiRequest } from '../lib/api'
import type { Category } from '../types/category'

export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
  description?: string | null
  isActive?: boolean
}

export async function getAdminCategories(): Promise<Category[]> {
  const data = await apiRequest<{ items: Category[] }>('/categories')
  return data.items
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const data = await apiRequest<{ item: Category }>('/categories', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return data.item
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  const data = await apiRequest<{ item: Category }>(`/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return data.item
}

export async function deleteCategory(id: string): Promise<Category> {
  const data = await apiRequest<{ item: Category }>(`/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return data.item
}