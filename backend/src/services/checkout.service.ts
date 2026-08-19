import prisma from '../lib/prisma'
import { ApiError } from '../utils/ApiError'
import { getAddress, type AddressResponse } from './address.service'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const SHIPPING_RULES = {
  freeShippingThreshold: 5000,
  shippingFee: 500,
} as const

type CheckoutPreviewProduct = {
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

type CheckoutPreviewItem = {
  id: string
  quantity: number
  subtotal: number
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

export type CheckoutPreviewResponse = {
  address: AddressResponse
  cart: {
    id: string
    items: CheckoutPreviewItem[]
    totalQuantity: number
  }
  subtotal: number
  shipping: number
  total: number
}

function serializeProduct(product: CheckoutPreviewProduct): CheckoutPreviewItem['product'] {
  return {
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
  }
}

export async function getCheckoutPreview(
  userId: string,
  addressId: string,
): Promise<CheckoutPreviewResponse> {
  if (!UUID_PATTERN.test(addressId)) {
    throw new ApiError(400, 'Invalid address UUID format', true, 'INVALID_ADDRESS_UUID')
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
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

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cart is empty', true, 'EMPTY_CART')
  }

  const items: CheckoutPreviewItem[] = []
  let subtotal = 0

  for (const item of cart.items) {
    const product = item.product
    if (!product) {
      throw new ApiError(404, 'Product not found', true, 'PRODUCT_NOT_FOUND')
    }
    if (!product.isActive) {
      throw new ApiError(400, 'Product is not available for purchase', true, 'PRODUCT_INACTIVE')
    }
    if (product.stock === 0) {
      throw new ApiError(400, 'Product is out of stock', true, 'PRODUCT_OUT_OF_STOCK')
    }
    if (item.quantity > product.stock) {
      throw new ApiError(
        400,
        `Requested quantity exceeds available stock for ${product.name}`,
        true,
        'INSUFFICIENT_STOCK',
      )
    }

    const lineSubtotal = product.price * item.quantity
    subtotal += lineSubtotal
    items.push({
      id: item.id,
      quantity: item.quantity,
      subtotal: lineSubtotal,
      product: serializeProduct(product as CheckoutPreviewProduct),
    })
  }

  const address = await getAddress(userId, addressId)

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping =
    subtotal >= SHIPPING_RULES.freeShippingThreshold ? 0 : SHIPPING_RULES.shippingFee
  const total = subtotal + shipping

  return {
    address,
    cart: { id: cart.id, items, totalQuantity },
    subtotal,
    shipping,
    total,
  }
}