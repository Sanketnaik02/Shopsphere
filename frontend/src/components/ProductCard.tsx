import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/currency'
import type { Product } from '../types/product'

function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false)
  const hasImage = Boolean(product.imageUrl) && !failed

  if (!hasImage) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 p-4 text-sm text-slate-400">
        <span>No image available</span>
      </div>
    )
  }

  return (
    <img
      src={product.imageUrl ?? ''}
      alt={`${product.name} image`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
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
      data-testid="product-stock"
      className="flex items-center gap-1.5 text-sm font-medium text-slate-600"
    >
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
      <span>{label}</span>
    </p>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const detailsUrl = `/products/${product.id}`

  return (
    <article
      data-testid="product-card"
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <Link
        to={detailsUrl}
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
      >
        <ProductImage product={product} />
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
          <h3 className="mt-1 text-base font-semibold leading-snug text-slate-900">
            <Link
              to={detailsUrl}
              data-testid="product-name"
              className="line-clamp-2 transition-colors hover:text-indigo-600 focus:outline-none focus-visible:underline"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="flex items-center gap-1 text-sm text-slate-700">
          <span aria-hidden="true" className="text-amber-500">
            ★
          </span>
          <span aria-label={`Rating ${product.rating ?? 0} out of 5`}>
            {product.rating ?? 0}
          </span>
        </div>

        <p
          data-testid="product-price"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          {formatPrice(product.price)}
        </p>

        <StockStatus stock={product.stock} />

        <Link
          to={detailsUrl}
          data-testid="view-product-button"
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </article>
  )
}