import prisma from '../lib/prisma'
import { ApiError } from '../utils/ApiError'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type CartItemProduct = {
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

type CartItemResponse = {
  id: string
  quantity: number
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
  subtotal: number
}

export type CartResponse = {
  id: string
  items: CartItemResponse[]
  totalQuantity: number
  totalAmount: number
}

function serializeCart(cart: {
  id: string
  items: Array<{
    id: string
    quantity: number
    product: CartItemProduct
  }>
}): CartResponse {
  const items = cart.items.map((item) => {
    const product = item.product
    return {
      id: item.id,
      quantity: item.quantity,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryName: product.category ? product.category.name : null,
        categorySlug: product.category ? product.category.slug : null,
        rating: product.rating,
        isActive: product.isActive,
      },
      subtotal: product.price * item.quantity,
    }
  })

  return {
    id: cart.id,
    items,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
  }
}

async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } })
  if (existing) {
    return existing
  }
  return prisma.cart.create({ data: { userId } })
}

async function fetchCart(userId: string): Promise<CartResponse> {
  const cart = await getOrCreateCart(userId)
  const full = await prisma.cart.findUniqueOrThrow({
    where: { id: cart.id },
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
  return serializeCart(full as any)
}

export async function getCart(userId: string): Promise<CartResponse> {
  return fetchCart(userId)
}

export async function addItem(
  userId: string,
  productId: string,
  quantity: number,
): Promise<CartResponse> {
  if (!UUID_PATTERN.test(productId)) {
    throw new ApiError(400, 'Invalid product UUID format', true, 'INVALID_PRODUCT_UUID')
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) {
    throw new ApiError(404, 'Product not found', true, 'PRODUCT_NOT_FOUND')
  }
  if (!product.isActive) {
    throw new ApiError(400, 'Product is not available for purchase', true, 'PRODUCT_INACTIVE')
  }
  if (product.stock === 0) {
    throw new ApiError(400, 'Product is out of stock', true, 'PRODUCT_OUT_OF_STOCK')
  }
  if (quantity > product.stock) {
    throw new ApiError(400, 'Requested quantity exceeds available stock', true, 'INSUFFICIENT_STOCK')
  }

  const cart = await getOrCreateCart(userId)

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  })

  if (existing) {
    const finalQuantity = existing.quantity + quantity
    if (finalQuantity > product.stock) {
      throw new ApiError(
        400,
        `Only ${product.stock} units available in stock`,
        true,
        'INSUFFICIENT_STOCK',
      )
    }
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: finalQuantity },
    })
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    })
  }

  return fetchCart(userId)
}

export async function updateItem(
  userId: string,
  itemId: string,
  quantity: number,
): Promise<CartResponse> {
  if (!UUID_PATTERN.test(itemId)) {
    throw new ApiError(400, 'Invalid cart item UUID format', true, 'INVALID_ITEM_UUID')
  }

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
    include: { product: true },
  })
  if (!item) {
    throw new ApiError(404, 'Cart item not found', true, 'CART_ITEM_NOT_FOUND')
  }

  const product = item.product
  if (!product.isActive) {
    throw new ApiError(400, 'Product is not available for purchase', true, 'PRODUCT_INACTIVE')
  }
  if (product.stock === 0) {
    throw new ApiError(400, 'Product is out of stock', true, 'PRODUCT_OUT_OF_STOCK')
  }
  if (quantity > product.stock) {
    throw new ApiError(400, 'Requested quantity exceeds available stock', true, 'INSUFFICIENT_STOCK')
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  })

  return fetchCart(userId)
}

export async function removeItem(userId: string, itemId: string): Promise<CartResponse> {
  if (!UUID_PATTERN.test(itemId)) {
    throw new ApiError(400, 'Invalid cart item UUID format', true, 'INVALID_ITEM_UUID')
  }

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
    select: { id: true },
  })
  if (!item) {
    throw new ApiError(404, 'Cart item not found', true, 'CART_ITEM_NOT_FOUND')
  }

  await prisma.cartItem.delete({ where: { id: item.id } })

  return fetchCart(userId)
}

export async function clearCart(userId: string): Promise<CartResponse> {
  const cart = await getOrCreateCart(userId)
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  return fetchCart(userId)
}