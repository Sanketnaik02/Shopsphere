import { ORDER_STATUS, type Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { ApiError } from '../utils/ApiError'
import { SHIPPING_RULES } from './checkout.service'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type OrderItemRecord = {
  id: string
  productId: string | null
  productName: string
  productBrand: string
  unitPrice: number
  quantity: number
  subtotal: number
}

type OrderRecord = {
  id: string
  status: ORDER_STATUS
  createdAt: Date
  updatedAt: Date
  subtotal: number
  shippingAmount: number
  totalAmount: number
  shippingFullName: string
  shippingPhone: string
  shippingAddressLine1: string
  shippingAddressLine2: string | null
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  items: OrderItemRecord[]
}

export type OrderItemResponse = {
  id: string
  productId: string | null
  productName: string
  productBrand: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export type ShippingAddressSnapshot = {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
}

export type OrderResponse = {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  subtotal: number
  shippingAmount: number
  totalAmount: number
  shippingAddress: ShippingAddressSnapshot
  items: OrderItemResponse[]
  totalItems: number
}

export type OrderSummaryResponse = {
  id: string
  status: string
  createdAt: string
  totalAmount: number
  totalItems: number
}

function serializeOrder(order: OrderRecord): OrderResponse {
  const items: OrderItemResponse[] = order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    productBrand: item.productBrand,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    subtotal: item.subtotal,
  }))

  return {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    subtotal: order.subtotal,
    shippingAmount: order.shippingAmount,
    totalAmount: order.totalAmount,
    shippingAddress: {
      fullName: order.shippingFullName,
      phone: order.shippingPhone,
      addressLine1: order.shippingAddressLine1,
      addressLine2: order.shippingAddressLine2,
      city: order.shippingCity,
      state: order.shippingState,
      postalCode: order.shippingPostalCode,
      country: order.shippingCountry,
    },
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export async function placeOrder(
  userId: string,
  addressId: string,
): Promise<OrderResponse> {
  if (!UUID_PATTERN.test(addressId)) {
    throw new ApiError(400, 'Invalid address UUID format', true, 'INVALID_ADDRESS_UUID')
  }

  return prisma.$transaction(async (tx) => {
    const address = await tx.address.findFirst({ where: { id: addressId, userId } })
    if (!address) {
      throw new ApiError(404, 'Address not found', true, 'ADDRESS_NOT_FOUND')
    }

    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'Cart is empty', true, 'EMPTY_CART')
    }

    let subtotal = 0

    for (const item of cart.items) {
      const product = item.product
      if (!product) {
        throw new ApiError(404, 'Product not found', true, 'PRODUCT_NOT_FOUND')
      }
      if (!product.isActive) {
        throw new ApiError(
          400,
          'Product is not available for purchase',
          true,
          'PRODUCT_INACTIVE',
        )
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
      subtotal += product.price * item.quantity
    }

    const shippingAmount =
      subtotal >= SHIPPING_RULES.freeShippingThreshold ? 0 : SHIPPING_RULES.shippingFee
    const totalAmount = subtotal + shippingAmount

    const order = await tx.order.create({
      data: {
        userId,
        addressId: address.id,
        status: ORDER_STATUS.CONFIRMED,
        subtotal,
        shippingAmount,
        totalAmount,
        shippingFullName: address.fullName,
        shippingPhone: address.phone,
        shippingAddressLine1: address.addressLine1,
        shippingAddressLine2: address.addressLine2,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPostalCode: address.postalCode,
        shippingCountry: address.country,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productBrand: item.product.brand,
            unitPrice: item.product.price,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    for (const item of cart.items) {
      const result = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      })
      if (result.count !== 1) {
        throw new ApiError(
          400,
          `Requested quantity exceeds available stock for ${item.product.name}`,
          true,
          'INSUFFICIENT_STOCK',
        )
      }
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

    return serializeOrder(order as OrderRecord)
  })
}

export async function getOrders(userId: string): Promise<OrderSummaryResponse[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: { select: { quantity: true } } },
  })

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    totalAmount: order.totalAmount,
    totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
  }))
}

export async function getOrder(userId: string, id: string): Promise<OrderResponse> {
  if (!UUID_PATTERN.test(id)) {
    throw new ApiError(400, 'Invalid order UUID format', true, 'INVALID_ORDER_UUID')
  }

  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: { orderBy: { id: 'asc' } } },
  })

  if (!order) {
    throw new ApiError(404, 'Order not found', true, 'ORDER_NOT_FOUND')
  }

  return serializeOrder(order as OrderRecord)
}

export async function cancelOrder(userId: string, id: string): Promise<OrderResponse> {
  if (!UUID_PATTERN.test(id)) {
    throw new ApiError(400, 'Invalid order UUID format', true, 'INVALID_ORDER_UUID')
  }

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id, userId },
      include: { items: { orderBy: { id: 'asc' } } },
    })

    if (!order) {
      throw new ApiError(404, 'Order not found', true, 'ORDER_NOT_FOUND')
    }

    if (order.status === ORDER_STATUS.CANCELLED) {
      throw new ApiError(409, 'Order is already cancelled', true, 'ORDER_NOT_CANCELLABLE')
    }

    if (order.status !== ORDER_STATUS.CONFIRMED) {
      throw new ApiError(
        409,
        'Only confirmed orders can be cancelled',
        true,
        'ORDER_NOT_CANCELLABLE',
      )
    }

    for (const item of order.items) {
      if (item.productId) {
        await tx.product.updateMany({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      }
    }

    const updated = await tx.order.update({
      where: { id: order.id },
      data: { status: ORDER_STATUS.CANCELLED },
      include: { items: true },
    })

    return serializeOrder(updated as OrderRecord)
  })
}