import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { WishlistSkeleton } from '../components/WishlistSkeleton'
import { useWishlist } from '../context/use-wishlist'
import { apiErrorMessage } from '../utils/api-error'
import { formatPrice } from '../utils/currency'
import type { WishlistItem } from '../types/wishlist'

function EmptyState() {
  return (
    <div
      data-testid="wishlist-empty"
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Wishlist is empty</h1>
      <p className="mt-3 text-slate-600">
        Save products you love and find them here later.
      </p>
      <Link
        to="/products"
        data-testid="wishlist-continue-shopping"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Explore Products
      </Link>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Unable to load your wishlist
      </h1>
      <p className="mt-3 text-slate-600">
        Something went wrong while loading your wishlist.
      </p>
      <button
        onClick={onRetry}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  )
}

function WishlistImage({ item }: { item: WishlistItem }) {
  const [failed, setFailed] = useState(false)
  const hasImage = Boolean(item.product.imageUrl) && !failed

  if (!hasImage) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 p-4 text-sm text-slate-400">
        <span>No image available</span>
      </div>
    )
  }

  return (
    <img
      src={item.product.imageUrl ?? ''}
      alt={`${item.product.name} image`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain p-4"
    />
  )
}

function StockStatus({ stock }: { stock: number }) {
  let dot = 'bg-emerald-500'
  let label = 'In Stock'

  if (stock === 0) {
    dot = 'bg-slate-400'
    label = 'Out of Stock'
  } else if (stock <= 5) {
    dot = 'bg-amber-500'
    label = `Only ${stock} left`
  }

  return (
    <p
      data-testid="wishlist-item-stock"
      className="flex items-center gap-1.5 text-sm font-medium text-slate-600"
    >
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
      <span>{label}</span>
    </p>
  )
}

function WishlistItemCard({
  item,
  removing,
  onRemove,
}: {
  item: WishlistItem
  removing: boolean
  onRemove: () => void
}) {
  const { product } = item
  const productUrl = `/products/${product.id}`

  return (
    <article
      data-testid="wishlist-item"
      className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <Link
        to={productUrl}
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
      >
        <WishlistImage item={item} />
        {product.categoryName ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
            {product.categoryName}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {product.brand ?? 'ShopSphere'}
          </p>
          <h3
            data-testid="wishlist-item-name"
            className="mt-1 text-base font-semibold leading-snug text-slate-900"
          >
            <Link
              to={productUrl}
              className="line-clamp-2 transition-colors hover:text-indigo-600 focus:outline-none focus-visible:underline"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <p
          data-testid="wishlist-item-price"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          {formatPrice(product.price)}
        </p>

        <StockStatus stock={product.stock} />

        <div className="mt-auto flex flex-col gap-2">
          <Link
            to={productUrl}
            data-testid="wishlist-view-product"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            View Product
          </Link>
          <button
            type="button"
            data-testid="wishlist-remove-item"
            aria-label={`Remove ${product.name} from wishlist`}
            onClick={onRemove}
            disabled={removing}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}

export function WishlistPage() {
  const { wishlist, loading, error, refreshWishlist, removeItem, clearWishlist } =
    useWishlist()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId)
    setNotice(null)
    try {
      await removeItem(itemId)
      setNotice('Item removed from wishlist.')
    } catch (err) {
      setNotice(apiErrorMessage(err, 'Could not remove the item.'))
    } finally {
      setRemovingId(null)
    }
  }

  const handleClear = async () => {
    setClearing(true)
    setNotice(null)
    try {
      await clearWishlist()
      setNotice('Wishlist cleared.')
    } catch (err) {
      setNotice(apiErrorMessage(err, 'Could not clear the wishlist.'))
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6">
        {loading ? <WishlistSkeleton /> : null}

        {!loading && error ? <ErrorState onRetry={() => void refreshWishlist()} /> : null}

        {!loading && !error && wishlist && wishlist.items.length === 0 ? (
          <EmptyState />
        ) : null}

        {!loading && !error && wishlist && wishlist.items.length > 0 ? (
          <div data-testid="wishlist-page" className="pb-16">
            <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Wishlist
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  {wishlist.totalItems} {wishlist.totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                type="button"
                data-testid="wishlist-clear"
                onClick={() => void handleClear()}
                disabled={clearing}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                Clear Wishlist
              </button>
            </div>

            <p aria-live="polite" className="min-h-5 text-sm font-medium text-slate-600">
              {notice}
            </p>

            <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.items.map((item) => (
                <WishlistItemCard
                  key={item.id}
                  item={item}
                  removing={removingId === item.id}
                  onRemove={() => void handleRemove(item.id)}
                />
              ))}
            </div>

            <Link
              to="/products"
              data-testid="wishlist-continue-shopping"
              className="mt-8 inline-flex text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 focus:outline-none focus-visible:underline"
            >
              Continue Shopping
            </Link>
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