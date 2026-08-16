import prisma from '../lib/prisma'
import type { Request, Response } from 'express'
import { ApiError } from '../utils/ApiError'

interface CategoryResponse {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
}

export async function getCategories(): Promise<CategoryResponse[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
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

export async function getCategoryById(id: string): Promise<CategoryResponse | null> {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    return null
  }
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
  }
}

export async function createCategory(
  name: string,
  slug: string,
  description: string | null
): Promise<CategoryResponse> {
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
  })

  if (existing) {
    throw new ApiError(409, 'Category name or slug already exists', true, 'DUPLICATE_SLUG')
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      isActive: true,
    },
  })

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
  }
}

export async function updateCategory(
  id: string,
  name?: string,
  slug?: string,
  description?: string | null,
  isActive?: boolean
): Promise<CategoryResponse> {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, 'Category not found', true, 'CATEGORY_NOT_FOUND')
  }

  // Check for duplicate name/slug excluding current category
  const duplicate = await prisma.category.findFirst({
    where: {
      OR: [
        { name },
        { slug },
      ],
      NOT: { id },
    },
  })

  if (duplicate) {
    throw new ApiError(409, 'Category name or slug already exists', true, 'DUPLICATE_SLUG')
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive }),
    },
  })

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
  }
}

export async function softDeleteCategory(id: string): Promise<CategoryResponse> {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    throw new ApiError(404, 'Category not found', true, 'CATEGORY_NOT_FOUND')
  }

  // Check if category has products - prefer deactivation over deletion
  const hasProducts = await prisma.product.count({
    where: { categoryId: id, isActive: true },
  })

  if (hasProducts > 0) {
    // Deactivate the category if it has products
    const updated = await prisma.category.update({
      where: { id },
      data: { isActive: false },
    })
    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      isActive: updated.isActive,
    }
  }

  // Safe to delete if no active products
  const deleted = await prisma.category.update({
    where: { id },
    data: { isActive: false },
  })
  return {
    id: deleted.id,
    name: deleted.name,
    slug: deleted.slug,
    description: deleted.description,
    isActive: deleted.isActive,
  }
}