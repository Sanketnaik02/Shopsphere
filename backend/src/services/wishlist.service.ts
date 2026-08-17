import prisma from '../lib/prisma'
import { ApiError } from '../utils/ApiError'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type WishlistItemProduct = {
  id: string
  name: string
  slug: string
  brand: string | null
  price: number
  stock: number
  imageUrl: string | null
  rating: number | null
  isActive: boolean
  category: { name: string; slug: string } | null
}

type WishlistItemResponse = {
  id: string
  product: {
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
}

export type WishlistResponse = {
  id: string
  items: WishlistItemResponse[]
  totalItems: number
}

function serializeWishlist(wishlist: {
  id: string
  items: Array<{ id: string; product: WishlistItemProduct }>
}): WishlistResponse {
  const items = wishlist.items.map((item) => ({
    id: item.id,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      brand: item.product.brand,
      price: item.product.price,
      stock: item.product.stock,
      imageUrl: item.product.imageUrl,
      categoryName: item.product.category ? item.product.category.name : null,
      categorySlug: item.product.category ? item.product.category.slug : null,
      rating: item.product.rating,
      isActive: item.product.isActive,
    },
  }))

  return {
    id: wishlist.id,
    items,
    totalItems: items.length,
  }
}

async function getOrCreateWishlist(userId: string) {
  const existing = await prisma.wishlist.findUnique({ where: { userId } })
  if (existing) {
    return existing
  }
  return prisma.wishlist.create({ data: { userId } })
}

async function fetchWishlist(userId: string): Promise<WishlistResponse> {
  const wishlist = await getOrCreateWishlist(userId)
  const full = await prisma.wishlist.findUniqueOrThrow({
    where: { id: wishlist.id },
    include: {
      items: {
        include: {
          product: {
            include: { category: { select: { name: true, slug: true } } },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
  return serializeWishlist(full as any)
}

export async function getWishlist(userId: string): Promise<WishlistResponse> {
  return fetchWishlist(userId)
}

export async function addItem(userId: string, productId: string): Promise<WishlistResponse> {
  if (!UUID_PATTERN.test(productId)) {
    throw new ApiError(400, 'Invalid product UUID format', true, 'INVALID_PRODUCT_UUID')
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) {
    throw new ApiError(404, 'Product not found', true, 'PRODUCT_NOT_FOUND')
  }
  if (!product.isActive) {
    throw new ApiError(400, 'Product is not available for wishlist', true, 'PRODUCT_INACTIVE')
  }

  const wishlist = await getOrCreateWishlist(userId)

  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  })
  if (existing) {
    throw new ApiError(409, 'Product already in wishlist', true, 'WISHLIST_ITEM_EXISTS')
  }

  await prisma.wishlistItem.create({
    data: { wishlistId: wishlist.id, productId },
  })

  return fetchWishlist(userId)
}

export async function removeItem(userId: string, itemId: string): Promise<WishlistResponse> {
  if (!UUID_PATTERN.test(itemId)) {
    throw new ApiError(400, 'Invalid wishlist item UUID format', true, 'INVALID_ITEM_UUID')
  }

  const item = await prisma.wishlistItem.findFirst({
    where: { id: itemId, wishlist: { userId } },
    select: { id: true },
  })
  if (!item) {
    throw new ApiError(404, 'Wishlist item not found', true, 'WISHLIST_ITEM_NOT_FOUND')
  }

  await prisma.wishlistItem.delete({ where: { id: item.id } })

  return fetchWishlist(userId)
}

export async function clearWishlist(userId: string): Promise<WishlistResponse> {
  const wishlist = await getOrCreateWishlist(userId)
  await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } })
  return fetchWishlist(userId)
}