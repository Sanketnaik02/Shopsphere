import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { OrderDetailsSkeleton } from '../components/OrderSkeleton'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { getOrderById, cancelOrder } from '../api/orders'
import { ApiError } from '../lib/api'
import { apiErrorMessage } from '../utils/api-error'
import { formatPrice } from '../utils/currency'
import { formatDate } from '../utils/date'
import type { Order } from '../types/order'

function NotFoundState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order not found</h1>
      <p className="mt-3 text-slate-600">
        This order may have been removed or does not belong to your account.
      </p>
      <Link
        to="/orders"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Back to Orders
      </Link>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Unable to load this order
      </h1>
      <p className="mt-3 text-slate-600">Something went wrong while loading the order.</p>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          Try Again
        </button>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  )
}

function ShippingAddress({ order }: { order: Order }) {
  const { shippingAddress: address } = order

  return (
    <section
      aria-labelledby="shipping-address-heading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 id="shipping-address-heading" className="text-lg font-bold tracking-tight text-slate-900">
        Shipping Address
      </h2>
      <address className="mt-3 text-sm not-italic leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-900">{address.fullName}</p>
        <p>{address.phone}</p>
        <p>
          {address.addressLine1}
          {address.addressLine2 ? `, ${address.addressLine2}` : ''}
        </p>
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
      </address>
    </section>
  )
}

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const fromCheckout =
    (location.state as { fromCheckout?: boolean } | null)?.fromCheckout ?? false

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    setNotFound(false)
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }
    try {
      setOrder(await getOrderById(id))
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setNotFound(true)
      } else {
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const handleCancel = async () => {
    if (!order || cancelling) return
    setCancelling(true)
    setNotice(null)
    try {
      const updated = await cancelOrder(order.id)
      setOrder(updated)
      setConfirmingCancel(false)
      setNotice('Order cancelled. The products have been restored to stock.')
    } catch (err) {
      setNotice(apiErrorMessage(err, 'Could not cancel the order.'))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6">
        {loading ? <OrderDetailsSkeleton /> : null}

        {!loading && notFound ? <NotFoundState /> : null}

        {!loading && !notFound && error ? <ErrorState onRetry={() => void load()} /> : null}

        {!loading && !notFound && !error && order ? (
          <div data-testid="order-details-page" className="pb-16">
            {fromCheckout ? (
              <div
                data-testid="order-placed-banner"
                className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6"
              >
                <p className="text-lg font-bold text-emerald-800">Order placed successfully</p>
                <p className="mt-1 text-sm text-emerald-700">
                  Thank you for your purchase. A confirmation has been saved to your orders.
                </p>
                <Link
                  to="/products"
                  className="mt-3 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-2 transition-colors hover:text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : null}

            <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
              <div>
                <p className="font-mono text-sm font-semibold text-slate-500">#{order.id}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Order {formatDate(order.createdAt)}
                </h1>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <p aria-live="polite" className="min-h-5 text-sm font-medium text-slate-600">
              {notice}
            </p>

            <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
              <div className="space-y-8">
                <ShippingAddress order={order} />

                <section aria-labelledby="order-items-heading">
                  <h2
                    id="order-items-heading"
                    className="text-lg font-bold tracking-tight text-slate-900"
                  >
                    Items
                  </h2>
                  <ul
                    data-testid="order-items"
                    className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-4 p-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900">
                            {item.productName}
                          </p>
                          <p className="text-sm text-slate-500">
                            {item.productBrand || 'ShopSphere'} · Qty {item.quantity} ×{' '}
                            {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-slate-900">
                          {formatPrice(item.subtotal)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Summary</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Subtotal</dt>
                    <dd className="font-medium text-slate-900">
                      {formatPrice(order.subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Shipping</dt>
                    <dd className="font-medium text-slate-900">
                      {order.shippingAmount === 0
                        ? 'Free'
                        : formatPrice(order.shippingAmount)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <dt className="text-base font-semibold text-slate-900">Total</dt>
                    <dd className="text-xl font-bold tracking-tight text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </dd>
                  </div>
                </dl>

                {order.status === 'CONFIRMED' ? (
                  <div className="mt-6">
                    {confirmingCancel ? (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-700">
                          Cancel this order? The products will be restored to stock.
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void handleCancel()}
                            disabled={cancelling}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                          >
                            {cancelling ? 'Cancelling…' : 'Confirm Cancel'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingCancel(false)}
                            disabled={cancelling}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                          >
                            Keep Order
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        data-testid="cancel-order"
                        onClick={() => setConfirmingCancel(true)}
                        className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                ) : null}

                <Link
                  to="/orders"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  Back to Orders
                </Link>
              </aside>
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