import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { OrdersSkeleton } from '../components/OrderSkeleton'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { getOrders } from '../api/orders'
import { formatPrice } from '../utils/currency'
import { formatDate } from '../utils/date'
import type { OrderSummary } from '../types/order'

function EmptyState() {
  return (
    <div
      data-testid="orders-empty"
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        You haven't placed any orders yet
      </h1>
      <p className="mt-3 text-slate-600">When you place an order, it will show up here.</p>
      <Link
        to="/products"
        data-testid="orders-start-shopping"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Start Shopping
      </Link>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Unable to load your orders
      </h1>
      <p className="mt-3 text-slate-600">Something went wrong while loading your orders.</p>
      <button
        onClick={onRetry}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  )
}

function OrderCard({ order }: { order: OrderSummary }) {
  const shortId = order.id.slice(0, 8)

  return (
    <article
      data-testid="order-card"
      className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <p
          data-testid="order-id"
          title={order.id}
          className="font-mono text-sm font-semibold text-slate-700"
        >
          #{shortId}
        </p>
        <OrderStatusBadge status={order.status} />
      </div>

      <p className="mt-4 text-sm text-slate-500">{formatDate(order.createdAt)}</p>

      <div className="mt-2 flex items-end justify-between">
        <p
          data-testid="order-total"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          {formatPrice(order.totalAmount)}
        </p>
        <p className="text-sm text-slate-500">
          {order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
        </p>
      </div>

      <Link
        to={`/orders/${order.id}`}
        data-testid="order-view-details"
        className="mt-6 inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
      >
        View Details
      </Link>
    </article>
  )
}

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      setOrders(await getOrders())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6">
        {loading ? <OrdersSkeleton /> : null}

        {!loading && error ? <ErrorState onRetry={() => void load()} /> : null}

        {!loading && !error && orders && orders.length === 0 ? <EmptyState /> : null}

        {!loading && !error && orders && orders.length > 0 ? (
          <div data-testid="orders-page" className="pb-16">
            <div className="py-8 sm:py-10">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Orders
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        ) : null}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-slate-500">
          ShopSphere — E-Commerce System Under Test
        </div>
      </footer>
    </div>
  )
}