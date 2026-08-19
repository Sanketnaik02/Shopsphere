import { apiRequest } from '../lib/api'
import type { Order, OrderSummary } from '../types/order'

interface OrdersEnvelope {
  orders: OrderSummary[]
}

interface OrderEnvelope {
  order: Order
}

export async function placeOrder(addressId: string): Promise<Order> {
  const data = await apiRequest<OrderEnvelope>('/orders', {
    method: 'POST',
    body: JSON.stringify({ addressId }),
  })
  return data.order
}

export async function getOrders(): Promise<OrderSummary[]> {
  const data = await apiRequest<OrdersEnvelope>('/orders')
  return data.orders
}

export async function getOrderById(id: string): Promise<Order> {
  const data = await apiRequest<OrderEnvelope>(`/orders/${encodeURIComponent(id)}`)
  return data.order
}

export async function cancelOrder(id: string): Promise<Order> {
  const data = await apiRequest<OrderEnvelope>(
    `/orders/${encodeURIComponent(id)}/cancel`,
    { method: 'POST' },
  )
  return data.order
}