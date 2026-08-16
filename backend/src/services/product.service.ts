import prisma from '../lib/prisma'
import type { Request, Response } from 'express'
import { ApiError } from '../utils/ApiError'
import { PRODUCT_LIST_DEFAULT_PAGE, PRODUCT_LIST_DEFAULT_LIMIT, PRODUCT_LIST_MAX_LIMIT } from '../validators/product.validators'

type ProductListItem = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  categoryName: string | null
  categorySlug: string | null
  brand: string | null
  imageUrl: string | null
  stock: number
  rating: number | null
  isActive: boolean
}

type ProductDetail = ProductListItem & {
  createdAt: Date
  updatedAt: Date
}

type Pagination = {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export async function getActiveProducts(
  searchTerm?: string,
  categoryId?: string,
  minPrice?: number,
  maxPrice?: number,
  inStock?: string,
  sortBy?: string,
  sortOrder?: string,
  page: number = PRODUCT_LIST_DEFAULT_PAGE,
  limit: number = PRODUCT_LIST_DEFAULT_LIMIT
): Promise<{ items: ProductListItem[]; pagination: Pagination }> {
  const where: any = {}
  where.isActive = true

  if (categoryId) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidPattern.test(categoryId)) {
      throw new ApiError(400, 'Invalid category UUID format', true, 'INVALID_CATEGORY_UUID')
    }
    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      throw new ApiError(404, 'Category not found', true, 'CATEGORY_NOT_FOUND')
    }
    where.categoryId = categoryId
  }

  const trimmedSearch = searchTerm ? searchTerm.trim() : ''
  const maxLength = 100
  const searchParam = trimmedSearch.substring(0, maxLength)

  if (searchParam) {
    where.OR = [
      { name: { contains: searchParam } },
      { brand: { contains: searchParam } },
      { description: { contains: searchParam } },
    ]
  }

  if (minPrice !== undefined) {
    if (typeof minPrice !== 'number' || minPrice < 0 || !Number.isInteger(minPrice)) {
      throw new ApiError(400, 'minPrice must be an integer >= 0', true, 'INVALID_MIN_PRICE')
    }
    where.price = { ...where.price, gte: minPrice } as any
  }

  if (maxPrice !== undefined) {
    if (typeof maxPrice !== 'number' || maxPrice < 0 || !Number.isInteger(maxPrice)) {
      throw new ApiError(400, 'maxPrice must be an integer >= 0', true, 'INVALID_MAX_PRICE')
    }
    where.price = { ...where.price, lte: maxPrice } as any
  }

  if (inStock !== undefined) {
    const lowerInStock = inStock.toLowerCase()
    if (lowerInStock !== 'true' && lowerInStock !== 'false') {
      throw new ApiError(400, 'inStock must be "true" or "false"', true, 'INVALID_IN_STOCK')
    }
    if (lowerInStock === 'true') {
      where.stock = { gt: 0 }
    } else {
      where.stock = { equals: 0 }
    }
  }

  const validSortBy: Record<string, string> = {
    price: 'price',
    rating: 'rating',
    name: 'name',
    createdAt: 'createdAt',
  }

  const validSortOrder: Record<string, string> = {
    asc: 'asc',
    desc: 'desc',
  }

  let primarySortField: string
  let primarySortDirection: string

  if (sortBy) {
    if (!(sortBy in validSortBy)) {
      throw new ApiError(400, 'Invalid sort field: ' + sortBy, true, 'INVALID_SORT_BY')
    }
    primarySortField = validSortBy[sortBy]
    if (sortOrder) {
      if (!(sortOrder in validSortOrder)) {
        throw new ApiError(400, 'Invalid sort order: ' + sortOrder, true, 'INVALID_SORT_ORDER')
      }
      primarySortDirection = validSortOrder[sortOrder]
    } else {
      primarySortDirection = 'asc'
    }
  } else if (sortOrder) {
    throw new ApiError(400, 'sortOrder requires sortBy', true, 'SORT_BY_REQUIRED')
  } else {
    primarySortField = 'name'
    primarySortDirection = 'asc'
  }

  if (typeof page !== 'number' || !Number.isInteger(page) || page < 1) {
    throw new ApiError(400, 'page must be an integer >= 1', true, 'INVALID_PAGE')
  }
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > PRODUCT_LIST_MAX_LIMIT) {
    throw new ApiError(400, `limit must be an integer between 1 and ${PRODUCT_LIST_MAX_LIMIT}`, true, 'INVALID_LIMIT')
  }

  const skip = (page - 1) * limit
  const take = limit

  // Secondary ordering by id keeps pagination deterministic across identical sort values
  const orderBy: any = [{ [primarySortField]: primarySortDirection }, { id: 'asc' }]

  const [totalItems, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy,
      skip,
      take,
    }),
  ])

  const totalPages = Math.ceil(totalItems / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    items: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      categoryName: p.category ? p.category.name : null,
      categorySlug: p.category ? p.category.slug : null,
      brand: p.brand,
      imageUrl: p.imageUrl,
      stock: p.stock,
      rating: p.rating,
      isActive: p.isActive,
    })),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  }
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { name: true, slug: true } } },
  })
  if (!product) {
    return null
  }
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    categoryName: product.category ? product.category.name : null,
    categorySlug: product.category ? product.category.slug : null,
    brand: product.brand,
    imageUrl: product.imageUrl,
    stock: product.stock,
    rating: product.rating,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

export async function createProduct(
  name: string,
  slug: string,
  description: string | null,
  price: number,
  categoryId: string,
  brand: string | null,
  imageUrl: string | null,
  stock: number,
  rating: number | null
): Promise<ProductDetail> {
  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category) {
    throw new ApiError(400, 'Category does not exist', true, 'INVALID_CATEGORY')
  }
  const existing = await prisma.product.findFirst({ where: { slug } })
  if (existing) {
    throw new ApiError(409, 'Product slug already exists', true, 'DUPLICATE_SLUG')
  }
  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description ?? null,
      price,
      categoryId: categoryId ?? '',
      brand: brand ?? null,
      imageUrl: imageUrl ?? null,
      stock,
      rating: rating ?? 0,
      isActive: true,
    } as any,
  })
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    categoryName: category.name,
    categorySlug: category.slug,
    brand: product.brand,
    imageUrl: product.imageUrl,
    stock: product.stock,
    rating: product.rating,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

export async function updateProduct(
  id: string,
  name?: string,
  slug?: string,
  description?: string | null,
  price?: number,
  categoryId?: string,
  brand?: string | null,
  imageUrl?: string | null,
  stock?: number,
  rating?: number | null
): Promise<ProductDetail> {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, 'Product not found', true, 'PRODUCT_NOT_FOUND')
  }
  if (slug && slug !== existing.slug) {
    const duplicate = await prisma.product.findFirst({ where: { slug } })
    if (duplicate) {
      throw new ApiError(409, 'Product slug already exists', true, 'DUPLICATE_SLUG')
    }
  }
  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      throw new ApiError(400, 'Category does not exist', true, 'INVALID_CATEGORY')
    }
  }
  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(categoryId && { categoryId }),
      ...(brand !== undefined && { brand }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(stock !== undefined && { stock }),
      ...(rating !== undefined && { rating: rating! }),
    } as any
  })
  const cat = await prisma.category.findUnique({ where: { id: updated.categoryId } })
  return {
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    description: updated.description,
    price: updated.price,
    categoryName: cat ? cat.name : null,
    categorySlug: cat ? cat.slug : null,
    brand: updated.brand,
    imageUrl: updated.imageUrl,
    stock: updated.stock,
    rating: updated.rating,
    isActive: updated.isActive,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  }
}

export async function softDeleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, 'Product not found', true, 'PRODUCT_NOT_FOUND')
  }
const updated = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  })
  const cat = await prisma.category.findUnique({ where: { id: updated.categoryId } })
  return {
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    description: updated.description,
    price: updated.price,
    categoryName: cat ? cat.name : null,
    categorySlug: cat ? cat.slug : null,
    brand: updated.brand,
    imageUrl: updated.imageUrl,
    stock: updated.stock,
    rating: updated.rating,
    isActive: updated.isActive,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  }
}