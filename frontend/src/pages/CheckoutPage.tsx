import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { CheckoutSkeleton } from '../components/CheckoutSkeleton'
import { AddressCard } from '../components/AddressCard'
import { AddressForm } from '../components/AddressForm'
import { useCart } from '../context/use-cart'
import { getAddresses, createAddress, updateAddress, deleteAddress, type AddressInput } from '../api/addresses'
import { previewCheckout } from '../api/checkout'
import { placeOrder } from '../api/orders'
import { ApiError } from '../lib/api'
import { apiErrorMessage } from '../utils/api-error'
import { formatPrice } from '../utils/currency'
import type { Address } from '../types/address'
import type { CheckoutPreview } from '../types/checkout'

function EmptyCartState() {
  return (
    <div
      data-testid="checkout-empty-cart"
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your cart is empty</h1>
      <p className="mt-3 text-slate-600">Add some products before checking out.</p>
      <Link
        to="/products"
        data-testid="checkout-continue-shopping"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

function AddressesErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Unable to load your addresses
      </h1>
      <p className="mt-3 text-slate-600">Something went wrong while loading your saved addresses.</p>
      <button
        onClick={onRetry}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  )
}

function mapCheckoutError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    switch (error.errorCode) {
      case 'EMPTY_CART':
        return 'Your cart is empty.'
      case 'INSUFFICIENT_STOCK':
      case 'PRODUCT_INACTIVE':
      case 'PRODUCT_OUT_OF_STOCK':
        return 'Some items are no longer available in the requested quantity.'
      case 'ADDRESS_NOT_FOUND':
        return 'The selected address is no longer available. Please choose another.'
      default:
        return fallback
    }
  }
  return fallback
}

export function CheckoutPage() {
  const { cart, refreshCart } = useCart()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [addressesError, setAddressesError] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [preview, setPreview] = useState<CheckoutPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [placing, setPlacing] = useState(false)
  const [placingError, setPlacingError] = useState<string | null>(null)

  const loadAddresses = useCallback(async () => {
    setAddressesLoading(true)
    setAddressesError(false)
    try {
      const data = await getAddresses()
      setAddresses(data)
      setSelectedId((prev) => {
        if (prev && data.some((address) => address.id === prev)) return prev
        const defaultAddress = data.find((address) => address.isDefault)
        return defaultAddress ? defaultAddress.id : (data[0]?.id ?? null)
      })
    } catch {
      setAddressesError(true)
    } finally {
      setAddressesLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAddresses()
  }, [loadAddresses])

  const refreshPreview = useCallback(async (addressId: string) => {
    setPreviewLoading(true)
    setPreviewError(null)
    setPreview(null)
    try {
      const data = await previewCheckout(addressId)
      setPreview(data)
    } catch (error) {
      setPreviewError(mapCheckoutError(error, 'Unable to prepare checkout.'))
    } finally {
      setPreviewLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedId) {
      void refreshPreview(selectedId)
    } else {
      setPreview(null)
      setPreviewError(null)
    }
  }, [selectedId, refreshPreview])

  const handleFormSubmit = async (values: AddressInput) => {
    setFormSubmitting(true)
    setFormError(null)
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, values)
        const data = await getAddresses()
        setAddresses(data)
        if (values.isDefault) setSelectedId(editingAddress.id)
        setNotice('Address updated.')
      } else {
        const created = await createAddress(values)
        const data = await getAddresses()
        setAddresses(data)
        setSelectedId(created.id)
        setNotice('Address added.')
      }
      setFormOpen(false)
      setEditingAddress(null)
    } catch (error) {
      setFormError(apiErrorMessage(error, 'Could not save the address.'))
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    setDeletingId(id)
    setNotice(null)
    try {
      await deleteAddress(id)
      const data = await getAddresses()
      setAddresses(data)
      if (selectedId === id) {
        const defaultAddress = data.find((address) => address.isDefault)
        setSelectedId(defaultAddress ? defaultAddress.id : (data[0]?.id ?? null))
      }
      setNotice('Address deleted.')
    } catch (error) {
      setNotice(apiErrorMessage(error, 'Could not delete the address.'))
    } finally {
      setDeletingId(null)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedId || !preview || placing) return
    setPlacing(true)
    setPlacingError(null)
    try {
      const order = await placeOrder(selectedId)
      await refreshCart()
      navigate(`/orders/${order.id}`, { state: { fromCheckout: true } })
    } catch (error) {
      setPlacingError(mapCheckoutError(error, 'Unable to place order.'))
    } finally {
      setPlacing(false)
    }
  }

  const cartReady = cart !== null
  const cartEmpty = cartReady && cart.items.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6">
        {addressesLoading || !cartReady ? <CheckoutSkeleton /> : null}

        {!addressesLoading && cartReady && cartEmpty ? <EmptyCartState /> : null}

        {!addressesLoading && addressesError ? (
          <AddressesErrorState onRetry={() => void loadAddresses()} />
        ) : null}

        {!addressesLoading &&
        !addressesError &&
        cartReady &&
        !cartEmpty &&
        addresses ? (
          <div data-testid="checkout-page" className="pb-16">
            <div className="py-8 sm:py-10">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Checkout
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Review your order and place it.
              </p>
            </div>

            <p aria-live="polite" className="min-h-5 text-sm font-medium text-slate-600">
              {notice}
            </p>

            <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
              <div className="space-y-8">
                <section aria-labelledby="shipping-address-heading">
                  <div className="flex items-center justify-between">
                    <h2
                      id="shipping-address-heading"
                      className="text-lg font-bold tracking-tight text-slate-900"
                    >
                      Shipping Address
                    </h2>
                    <button
                      type="button"
                      data-testid="add-address"
                      onClick={() => {
                        setEditingAddress(null)
                        setFormError(null)
                        setFormOpen(true)
                      }}
                      disabled={placing}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                    >
                      + Add New Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                      <p className="text-sm font-medium text-slate-600">No shipping address yet</p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(null)
                          setFormError(null)
                          setFormOpen(true)
                        }}
                        disabled={placing}
                        className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div
                      role="radiogroup"
                      aria-label="Choose shipping address"
                      className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                      {addresses.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          selected={selectedId === address.id}
                          disabled={placing}
                          deleting={deletingId === address.id}
                          onSelect={() => setSelectedId(address.id)}
                          onEdit={() => {
                            setEditingAddress(address)
                            setFormError(null)
                            setFormOpen(true)
                          }}
                          onDelete={() => void handleDeleteAddress(address.id)}
                        />
                      ))}
                    </div>
                  )}
                </section>

                <section aria-labelledby="order-summary-heading">
                  <h2
                    id="order-summary-heading"
                    className="text-lg font-bold tracking-tight text-slate-900"
                  >
                    Order Summary
                  </h2>

                  {previewLoading ? (
                    <div
                      role="status"
                      aria-label="Preparing checkout"
                      className="mt-4 space-y-3"
                    >
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-16 animate-pulse rounded-lg bg-slate-200"
                        />
                      ))}
                    </div>
                  ) : null}

                  {!previewLoading && previewError ? (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-6">
                      <p className="text-sm font-medium text-red-700">{previewError}</p>
                      <Link
                        to="/cart"
                        data-testid="checkout-back-to-cart"
                        className="mt-3 inline-flex text-sm font-semibold text-red-700 underline underline-offset-2 transition-colors hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        Back to Cart
                      </Link>
                    </div>
                  ) : null}

                  {!previewLoading && !previewError && preview ? (
                    <div
                      data-testid="checkout-summary"
                      className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                      <ul className="divide-y divide-slate-100">
                        {preview.cart.items.map((item) => (
                          <li key={item.id} className="flex items-center gap-4 p-4">
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-slate-900">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {item.product.brand ?? 'ShopSphere'} · Qty {item.quantity} ×{' '}
                                {formatPrice(item.product.price)}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-bold text-slate-900">
                              {formatPrice(item.subtotal)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              </div>

              <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Payment Summary
                </h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Subtotal</dt>
                    <dd
                      data-testid="checkout-subtotal"
                      className="font-medium text-slate-900"
                    >
                      {preview ? formatPrice(preview.subtotal) : '—'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Shipping</dt>
                    <dd
                      data-testid="checkout-shipping"
                      className="font-medium text-slate-900"
                    >
                      {preview
                        ? preview.shipping === 0
                          ? 'Free'
                          : formatPrice(preview.shipping)
                        : '—'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <dt className="text-base font-semibold text-slate-900">Total</dt>
                    <dd
                      data-testid="checkout-total"
                      className="text-xl font-bold tracking-tight text-slate-900"
                    >
                      {preview ? formatPrice(preview.total) : '—'}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  data-testid="place-order"
                  onClick={() => void handlePlaceOrder()}
                  disabled={!selectedId || !preview || previewLoading || placing}
                  className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                >
                  {placing ? 'Placing Order…' : 'Place Order'}
                </button>

                {placingError ? (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700">{placingError}</p>
                    <Link
                      to="/cart"
                      data-testid="checkout-back-to-cart"
                      className="mt-2 inline-flex text-sm font-semibold text-red-700 underline underline-offset-2 transition-colors hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      Back to Cart
                    </Link>
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        ) : null}

        <AddressForm
          open={formOpen}
          address={editingAddress}
          submitting={formSubmitting}
          error={formError}
          onSubmit={(values) => void handleFormSubmit(values)}
          onClose={() => {
            setFormOpen(false)
            setEditingAddress(null)
            setFormError(null)
          }}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-slate-500">
          ShopSphere — E-Commerce System Under Test
        </div>
      </footer>
    </div>
  )
}