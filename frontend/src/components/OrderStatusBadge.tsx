import type { OrderStatus } from '../types/order'

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badge: string; dot: string }
> = {
  PENDING: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500',
  },
  CONFIRMED: {
    label: 'Confirmed',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  SHIPPED: {
    label: 'Shipped',
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    dot: 'bg-indigo-500',
  },
  DELIVERED: {
    label: 'Delivered',
    badge: 'bg-sky-50 text-sky-700 ring-sky-200',
    dot: 'bg-sky-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
    dot: 'bg-rose-500',
  },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING

  return (
    <span
      data-testid="order-status"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${config.badge}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}