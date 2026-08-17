import { useCallback, useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import { Navbar } from '../components/Navbar'
import { ProductCard } from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/ProductGridSkeleton'
import type { Product, Pagination } from '../types/product'

type ProductsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; items: Product[]; pagination: Pagination }

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-20 text-center">
      <h2 className="text-lg font-semibold text-slate-900">Unable to load products</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Something went wrong while loading the catalog.
      </p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <h2 className="text-lg font-semibold text-slate-900">No products found</h2>
      <p className="mt-2 text-sm text-slate-600">
        There are currently no products available.
      </p>
    </div>
  )
}

export function ProductsPage() {
  const [state, setState] = useState<ProductsState>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await getProducts()
      setState({ status: 'ready', items: data.items, pagination: data.pagination })
    } catch {
      setState({ status: 'error' })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:pt-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Discover Products
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Explore quality products across technology, electronics, gaming and more.
          </p>
          {state.status === 'ready' ? (
            <p data-testid="product-count" className="mt-6 text-sm font-medium text-slate-500">
              {state.pagination.totalItems} products available
            </p>
          ) : null}
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
          {state.status === 'loading' ? <ProductGridSkeleton /> : null}
          {state.status === 'error' ? <ErrorState onRetry={() => void load()} /> : null}
          {state.status === 'ready' ? (
            state.items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {state.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )
          ) : null}
        </section>
      </main>
    </div>
  )
}