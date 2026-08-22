import prisma from '../lib/prisma'
import { ApiError } from '../utils/ApiError'

interface CategoryResponse {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
}

export async function getAdminCategories(): Promise<CategoryResponse[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    isActive: c.isActive,
  }))
}

export async function reactivateCategory(id: string): Promise<CategoryResponse> {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidPattern.test(id)) {
    throw new ApiError(400, 'Invalid category UUID format', true, 'INVALID_CATEGORY_UUID')
  }

  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, 'Category not found', true, 'ADMIN_CATEGORY_NOT_FOUND')
  }

  if (existing.isActive) {
    throw new ApiError(409, 'Category is already active', true, 'ALREADY_ACTIVE')
  }

  const updated = await prisma.category.update({
    where: { id },
    data: { isActive: true },
  })

  return {
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    description: updated.description,
    isActive: updated.isActive,
  }
}