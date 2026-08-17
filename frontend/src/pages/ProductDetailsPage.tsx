import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { ProductDetailsSkeleton } from '../components/ProductDetailsSkeleton'
import { getProductById } from '../api/products'
import { formatPrice } from '../utils/currency'
import { apiErrorMessage } from '../utils/api-error'
import { ApiError } from '../lib/api'
import { useAuth } from '../context/use-auth'
import { useCart } from '../context/use-cart'
import { useWishlist } from '../context/use-wishlist'
import type { Product } from '../types/product'

type DetailsState =
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error' }
  | { status: 'ready'; product: Product }

function Breadcrumb({ productName }: { productName?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="py-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <li>
          <Link to="/" className="transition-colors hover:text-indigo-600">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            to="/products"
            data-testid="breadcrumb-products"
            className="transition-colors hover:text-indigo-600"
          >
            Products
          </Link>
        </li>
        {productName ? (
          <>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="truncate font-medium text-slate-900">
              {productName}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  )
}

function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false)
  const hasImage = Boolean(product.imageUrl) && !failed

  return (
    <div className="aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      {hasImage ? (
        <img
          src={product.imageUrl ?? ''}
          alt={`${product.name} image`}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-6"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6 text-sm text-slate-400">
          Image unavailable
        </div>
      )}
    </div>
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
      data-testid="product-detail-stock"
      className="flex items-center gap-1.5 text-sm font-medium text-slate-600"
    >
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
      <span>{label}</span>
    </p>
  )
}

function QuantitySelector({
  stock,
  quantity,
  onDecrease,
  onIncrease,
}: {
  stock: number
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
}) {
  const outOfStock = stock === 0
  const buttonClass =
    'flex h-11 w-11 items-center justify-center text-lg font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600'

  return (
    <div>
      <p id="quantity-label" className="text-sm font-medium text-slate-700">
        Quantity
      </p>
      <div
        role="group"
        aria-labelledby="quantity-label"
        className="mt-2 inline-flex items-center rounded-lg border border-slate-300 bg-white"
      >
        <button
          type="button"
          data-testid="quantity-decrease"
          aria-label="Decrease quantity"
          onClick={onDecrease}
          disabled={outOfStock || quantity <= 1}
          className={`rounded-l-lg ${buttonClass}`}
        >
          −
        </button>
        <span
          aria-live="polite"
          className="w-12 text-center text-base font-semibold text-slate-900"
        >
          {quantity}
        </span>
        <button
          type="button"
          data-testid="quantity-increase"
          aria-label="Increase quantity"
          onClick={onIncrease}
          disabled={outOfStock || quantity >= stock}
          className={`rounded-r-lg ${buttonClass}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

function AddToCartButton({
  stock,
  pending,
  onClick,
}: {
  stock: number
  pending: boolean
  onClick: () => void
}) {
  if (stock === 0) {
    return (
      <button
        type="button"
        data-testid="add-to-cart"
        disabled
        className="inline-flex w-full items-center justify-center rounded-lg bg-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-500 sm:w-auto"
      >
        Out of Stock
      </button>
    )
  }

  return (
    <button
      type="button"
      data-testid="add-to-cart"
      onClick={onClick}
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 sm:w-auto"
    >
      {pending ? 'Adding…' : 'Add to Cart'}
    </button>
  )
}

function WishlistButton({
  inWishlist,
  pending,
  onAdd,
}: {
  inWishlist: boolean
  pending: boolean
  onAdd: () => void
}) {
  if (inWishlist) {
    return (
      <button
        type="button"
        data-testid="wishlist-add"
        disabled
        aria-label="Product is in wishlist"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-6 py-3.5 text-sm font-semibold text-indigo-600 sm:w-auto"
      >
        <span aria-hidden="true">♥</span> In Wishlist
      </button>
    )
  }

  return (
    <button
      type="button"
      data-testid="wishlist-add"
      aria-label="Add to wishlist"
      onClick={onAdd}
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 sm:w-auto"
    >
      <span aria-hidden="true">♡</span> Add to Wishlist
    </button>
  )
}

function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product not found</h1>
      <p className="mt-3 max-w-md text-slate-600">
        The product you're looking for may have been removed or is no longer available.
      </p>
      <Link
        to="/products"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Back to Products
      </Link>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Unable to load this product
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        Something went wrong while loading the product.
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

type AddFeedback = { type: 'success' } | { type: 'error'; message: string } | null
type WishlistFeedback = { type: 'success' } | { type: 'error'; message: string } | null

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { addToCart, refreshCart } = useCart()
  const { isInWishlist, addItem: addToWishlist, refreshWishlist } = useWishlist()
  const [state, setState] = useState<DetailsState>({ status: 'loading' })
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [feedback, setFeedback] = useState<AddFeedback>(null)
  const [wishlistPending, setWishlistPending] = useState(false)
  const [wishlistFeedback, setWishlistFeedback] = useState<WishlistFeedback>(null)

  const inWishlist = state.status === 'ready' ? isInWishlist(state.product.id) : false

  const load = useCallback(async () => {
    setFeedback(null)
    setWishlistFeedback(null)
    setQuantity(1)
    setState({ status: 'loading' })
    if (!id) {
      setState({ status: 'notFound' })
      return
    }
    try {
      const product = await getProductById(id)
      setState({ status: 'ready', product })
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        setState({ status: 'notFound' })
      } else {
        setState({ status: 'error' })
      }
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const handleAddToCart = async () => {
    if (!user) {
      setFeedback({ type: 'error', message: 'Please log in to add items to your cart.' })
      return
    }
    if (state.status !== 'ready') return
    setFeedback(null)
    setAdding(true)
    try {
      await addToCart(state.product.id, quantity)
      setFeedback({ type: 'success' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: apiErrorMessage(error, 'Could not add this product to your cart.'),
      })
      void refreshCart()
    } finally {
      setAdding(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      setWishlistFeedback({
        type: 'error',
        message: 'Please log in to save items to your wishlist.',
      })
      return
    }
    if (state.status !== 'ready' || inWishlist) return
    setWishlistFeedback(null)
    setWishlistPending(true)
    try {
      await addToWishlist(state.product.id)
      setWishlistFeedback({ type: 'success' })
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === 'WISHLIST_ITEM_EXISTS') {
        setWishlistFeedback({
          type: 'error',
          message: 'This product is already in your wishlist.',
        })
        void refreshWishlist()
      } else {
        setWishlistFeedback({
          type: 'error',
          message: apiErrorMessage(error, 'Could not add this product to your wishlist.'),
        })
      }
    } finally {
      setWishlistPending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6">
        {state.status === 'loading' ? <ProductDetailsSkeleton /> : null}
        {state.status === 'notFound' ? <NotFound /> : null}
        {state.status === 'error' ? <ErrorState onRetry={() => void load()} /> : null}

        {state.status === 'ready' ? (
          <div data-testid="product-detail" className="pb-16">
            <Breadcrumb productName={state.product.name} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              <ProductImage product={state.product} />

              <div className="flex flex-col gap-5">
                {state.product.categoryName ? (
                  <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                    {state.product.categoryName}
                  </span>
                ) : null}

                <h1
                  data-testid="product-detail-name"
                  className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                  {state.product.name}
                </h1>

                <p
                  data-testid="product-detail-brand"
                  className="text-sm font-medium text-slate-500"
                >
                  {state.product.brand ?? 'ShopSphere'}
                </p>

                <p
                  data-testid="product-detail-rating"
                  className="flex items-center gap-1.5 text-sm text-slate-700"
                >
                  <span aria-hidden="true" className="text-amber-500">
                    ★
                  </span>
                  <span aria-label={`Rating ${state.product.rating ?? 0} out of 5`}>
                    {state.product.rating ?? 0}
                  </span>
                </p>

                <p
                  data-testid="product-detail-price"
                  className="text-3xl font-bold tracking-tight text-slate-900"
                >
                  {formatPrice(state.product.price)}
                </p>

                <StockStatus stock={state.product.stock} />

                <div className="mt-2 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
                  <QuantitySelector
                    stock={state.product.stock}
                    quantity={quantity}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                    onIncrease={() =>
                      setQuantity((q) => Math.min(state.product.stock, q + 1))
                    }
                  />

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <AddToCartButton
                        stock={state.product.stock}
                        pending={adding}
                        onClick={() => void handleAddToCart()}
                      />
                      <WishlistButton
                        inWishlist={inWishlist}
                        pending={wishlistPending}
                        onAdd={() => void handleAddToWishlist()}
                      />
                    </div>
                    {feedback ? (
                      feedback.type === 'success' ? (
                        <p role="status" className="text-sm font-medium text-emerald-600">
                          Added to cart.{' '}
                          <Link
                            to="/cart"
                            className="font-semibold underline underline-offset-2 transition-colors hover:text-emerald-700"
                          >
                            Go to Cart
                          </Link>
                        </p>
                      ) : (
                        <p role="status" className="text-sm font-medium text-red-600">
                          {feedback.message}
                        </p>
                      )
                    ) : null}
                    {wishlistFeedback ? (
                      wishlistFeedback.type === 'success' ? (
                        <p role="status" className="text-sm font-medium text-indigo-600">
                          Saved to wishlist.{' '}
                          <Link
                            to="/wishlist"
                            className="font-semibold underline underline-offset-2 transition-colors hover:text-indigo-700"
                          >
                            View Wishlist
                          </Link>
                        </p>
                      ) : (
                        <p role="status" className="text-sm font-medium text-red-600">
                          {wishlistFeedback.message}
                        </p>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <section
              aria-labelledby="about-product-heading"
              className="border-t border-slate-200 pt-10"
            >
              <h2
                id="about-product-heading"
                className="text-2xl font-bold tracking-tight text-slate-900"
              >
                About this product
              </h2>
              <p
                data-testid="product-description"
                className="mt-4 max-w-prose text-base leading-7 text-slate-600"
              >
                {state.product.description || 'No description available.'}
              </p>
            </section>
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