import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { CartSkeleton } from '../components/CartSkeleton'
import { useCart } from '../context/use-cart'
import { apiErrorMessage } from '../utils/api-error'
import { formatPrice } from '../utils/currency'
import type { Cart, CartItem } from '../types/cart'

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Shopping cart is empty
      </h1>
      <p className="mt-3 text-slate-600">You haven't added any products yet.</p>
      <Link
        to="/products"
        data-testid="continue-shopping"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Unable to load your cart
      </h1>
      <p className="mt-3 text-slate-600">Something went wrong while loading your cart.</p>
      <button
        onClick={onRetry}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  )
}

function CartItemImage({ item }: { item: CartItem }) {
  const [failed, setFailed] = useState(false)
  const hasImage = Boolean(item.product.imageUrl) && !failed

  if (!hasImage) {
    return (
      <span className="flex h-full w-full items-center justify-center p-2 text-xs text-slate-400">
        No image
      </span>
    )
  }

  return (
    <img
      src={item.product.imageUrl ?? ''}
      alt={`${item.product.name} image`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain p-2"
    />
  )
}

function CartItemRow({
  item,
  updating,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem
  updating: boolean
  onQuantityChange: (next: number) => void
  onRemove: () => void
}) {
  const { product } = item
  const productUrl = `/products/${product.id}`
  const atMin = item.quantity <= 1
  const atMax = item.quantity >= product.stock
  const buttonClass =
    'flex h-10 w-10 items-center justify-center text-lg font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600'

  return (
    <li
      data-testid="cart-item"
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
    >
      <Link
        to={productUrl}
        aria-label={`View ${product.name}`}
        className="block h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100"
      >
        <CartItemImage item={item} />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={productUrl}
          data-testid="cart-item-name"
          className="font-semibold text-slate-900 transition-colors hover:text-indigo-600 focus:outline-none focus-visible:underline"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-sm text-slate-500">{product.brand ?? 'ShopSphere'}</p>
        <p
          data-testid="cart-item-price"
          className="mt-1 text-sm font-medium text-slate-700"
        >
          {formatPrice(product.price)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <div>
          <p id={`quantity-label-${item.id}`} className="text-xs font-medium text-slate-500">
            Quantity
          </p>
          <div
            role="group"
            aria-labelledby={`quantity-label-${item.id}`}
            className="mt-1 inline-flex items-center rounded-lg border border-slate-300 bg-white"
          >
            <button
              type="button"
              data-testid="quantity-decrease"
              aria-label="Decrease quantity"
              onClick={() => onQuantityChange(item.quantity - 1)}
              disabled={updating || atMin}
              className={`rounded-l-lg ${buttonClass}`}
            >
              −
            </button>
            <span aria-live="polite" className="w-10 text-center text-sm font-semibold text-slate-900">
              {item.quantity}
            </span>
            <button
              type="button"
              data-testid="quantity-increase"
              aria-label="Increase quantity"
              onClick={() => onQuantityChange(item.quantity + 1)}
              disabled={updating || atMax}
              className={`rounded-r-lg ${buttonClass}`}
            >
              +
            </button>
          </div>
          {product.stock > 0 && product.stock <= 5 ? (
            <p className="mt-1 text-xs font-medium text-amber-600">
              Only {product.stock} left in stock
            </p>
          ) : null}
        </div>

        <div className="text-right">
          <p
            data-testid="cart-item-subtotal"
            className="text-base font-bold text-slate-900"
          >
            {formatPrice(item.subtotal)}
          </p>
          <button
            type="button"
            data-testid="remove-cart-item"
            aria-label={`Remove ${product.name} from cart`}
            onClick={onRemove}
            disabled={updating}
            className="mt-1 rounded text-sm font-medium text-slate-500 transition-colors hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}

function OrderSummary({
  cart,
  clearing,
  onClear,
}: {
  cart: Cart
  clearing: boolean
  onClear: () => void
}) {
  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold tracking-tight text-slate-900">Order Summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">Items</dt>
          <dd className="font-medium text-slate-900">{cart.totalQuantity}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <dt className="text-slate-600">Subtotal</dt>
          <dd data-testid="cart-total" className="text-xl font-bold tracking-tight text-slate-900">
            {formatPrice(cart.totalAmount)}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="Checkout coming soon"
        className="mt-6 w-full cursor-not-allowed rounded-lg bg-slate-300 px-4 py-3 text-sm font-semibold text-slate-500"
      >
        Proceed to Checkout
        <span className="block text-xs font-normal">Coming soon</span>
      </button>
      <button
        type="button"
        data-testid="clear-cart"
        onClick={onClear}
        disabled={clearing}
        className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
      >
        Clear Cart
      </button>
    </aside>
  )
}

export function CartPage() {
  const { cart, loading, error, refreshCart, updateQuantity, removeItem, clearCart } =
    useCart()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const handleQuantity = async (itemId: string, next: number) => {
    if (next < 1) return
    setUpdatingId(itemId)
    setNotice(null)
    try {
      await updateQuantity(itemId, next)
    } catch (err) {
      setNotice(apiErrorMessage(err, 'Could not update quantity.'))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (itemId: string) => {
    setUpdatingId(itemId)
    setNotice(null)
    try {
      await removeItem(itemId)
      setNotice('Item removed from cart.')
    } catch (err) {
      setNotice(apiErrorMessage(err, 'Could not remove the item.'))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleClear = async () => {
    setClearing(true)
    setNotice(null)
    try {
      await clearCart()
      setNotice('Cart cleared.')
    } catch (err) {
      setNotice(apiErrorMessage(err, 'Could not clear the cart.'))
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6">
        {loading ? <CartSkeleton /> : null}

        {!loading && error ? <ErrorState onRetry={() => void refreshCart()} /> : null}

        {!loading && !error && cart && cart.items.length === 0 ? <EmptyState /> : null}

        {!loading && !error && cart && cart.items.length > 0 ? (
          <div data-testid="cart-page" className="pb-16">
            <div className="py-8 sm:py-10">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Shopping Cart
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'}
              </p>
            </div>

            <p aria-live="polite" className="min-h-5 text-sm font-medium text-slate-600">
              {notice}
            </p>

            <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
              <section aria-label="Cart items">
                <ul className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      updating={updatingId === item.id}
                      onQuantityChange={(next) => void handleQuantity(item.id, next)}
                      onRemove={() => void handleRemove(item.id)}
                    />
                  ))}
                </ul>
                <Link
                  to="/products"
                  data-testid="continue-shopping"
                  className="mt-6 inline-flex text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 focus:outline-none focus-visible:underline"
                >
                  Continue Shopping
                </Link>
              </section>

              <OrderSummary
                cart={cart}
                clearing={clearing}
                onClear={() => void handleClear()}
              />
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