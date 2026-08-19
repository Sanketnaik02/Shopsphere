export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderSummary {
  id: string
  status: OrderStatus
  createdAt: string
  totalAmount: number
  totalItems: number
}

export interface ShippingAddressSnapshot {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  id: string
  productId: string | null
  productName: string
  productBrand: string
  unitPrice: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  subtotal: number
  shippingAmount: number
  totalAmount: number
  shippingAddress: ShippingAddressSnapshot
  items: OrderItem[]
  totalItems: number
}