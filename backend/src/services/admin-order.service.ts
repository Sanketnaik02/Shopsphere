import { ORDER_STATUS, type Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import { ApiError } from '../utils/ApiError'

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
  userId: string
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

export type AdminOrderSummaryResponse = {
  id: string
  userId: string
  status: string
  createdAt: string
  totalAmount: number
  totalItems: number
}

export type AdminOrderResponse = {
  id: string
  userId: string
  status: string
  createdAt: string
  updatedAt: string
  subtotal: number
  shippingAmount: number
  totalAmount: number
  shippingAddress: {
    fullName: string
    phone: string
    addressLine1: string
    addressLine2: string | null
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: {
    id: string
    productId: string | null
    productName: string
    productBrand: string
    unitPrice: number
    quantity: number
    subtotal: number
  }[]
  totalItems: number
}

type Pagination = {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type AdminOrderListResponse = {
  items: AdminOrderSummaryResponse[]
  pagination: Pagination
}

function serializeOrder(order: OrderRecord): AdminOrderResponse {
  const items: AdminOrderResponse['items'] = order.items.map((item) => ({
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
    userId: order.userId,
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

function serializeOrderSummary(order: {
  id: string
  userId: string
  status: ORDER_STATUS
  createdAt: Date
  totalAmount: number
  items: { quantity: number }[]
}): AdminOrderSummaryResponse {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    totalAmount: order.totalAmount,
    totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

export async function getAdminOrders(
  page: number = 1,
  limit: number = 20,
): Promise<AdminOrderListResponse> {
  if (typeof page !== 'number' || !Number.isInteger(page) || page < 1) {
    throw new ApiError(400, 'page must be an integer >= 1', true, 'INVALID_PAGE')
  }
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new ApiError(400, 'limit must be an integer between 1 and 100', true, 'INVALID_LIMIT')
  }

  const skip = (page - 1) * limit
  const take = limit

  const [totalItems, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { select: { quantity: true } } },
      skip,
      take,
    }),
  ])

  const totalPages = Math.ceil(totalItems / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    items: orders.map(serializeOrderSummary),
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

export async function getAdminOrderById(id: string): Promise<AdminOrderResponse> {
  if (!UUID_PATTERN.test(id)) {
    throw new ApiError(400, 'Invalid order UUID format', true, 'INVALID_ORDER_UUID')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { orderBy: { id: 'asc' } } },
  })

  if (!order) {
    throw new ApiError(404, 'Order not found', true, 'ADMIN_ORDER_NOT_FOUND')
  }

  return serializeOrder(order as OrderRecord)
}

const VALID_TRANSITIONS: Record<ORDER_STATUS, ORDER_STATUS[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export async function updateAdminOrderStatus(
  id: string,
  newStatus: ORDER_STATUS,
): Promise<AdminOrderResponse> {
  if (!UUID_PATTERN.test(id)) {
    throw new ApiError(400, 'Invalid order UUID format', true, 'INVALID_ORDER_UUID')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { orderBy: { id: 'asc' } } },
  })

  if (!order) {
    throw new ApiError(404, 'Order not found', true, 'ADMIN_ORDER_NOT_FOUND')
  }

  const currentStatus = order.status
  if (currentStatus === newStatus) {
    return serializeOrder(order as OrderRecord)
  }

  const allowedTransitions = VALID_TRANSITIONS[currentStatus]
  if (!allowedTransitions.includes(newStatus)) {
    throw new ApiError(
      409,
      `Invalid status transition from ${currentStatus} to ${newStatus}`,
      true,
      'INVALID_ORDER_STATUS_TRANSITION',
    )
  }

  return prisma.$transaction(async (tx) => {
    if (newStatus === ORDER_STATUS.CANCELLED) {
      if (currentStatus === ORDER_STATUS.CONFIRMED) {
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.updateMany({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            })
          }
        }
      }
    }

    const updated = await tx.order.update({
      where: { id: order.id },
      data: { status: newStatus },
      include: { items: true },
    })

    return serializeOrder(updated as OrderRecord)
  })
}