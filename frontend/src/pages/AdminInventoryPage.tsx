import { useCallback, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Modal } from '../components/Modal'
import { Field } from '../components/Field'
import { formatPrice } from '../utils/currency'
import { getAdminProducts, updateProduct, type UpdateProductInput } from '../api/admin-products'
import type { Product } from '../types/product'

type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'INACTIVE'

function getStockStatus(product: Product): StockStatus {
  if (!product.isActive) return 'INACTIVE'
  if (product.stock === 0) return 'OUT_OF_STOCK'
  if (product.stock <= 10) return 'LOW_STOCK'
  return 'IN_STOCK'
}

function StockStatusBadge({ status }: { status: StockStatus }) {
  const variants: Record<StockStatus, string> = {
    IN_STOCK: 'bg-emerald-100 text-emerald-800',
    LOW_STOCK: 'bg-amber-100 text-amber-800',
    OUT_OF_STOCK: 'bg-red-100 text-red-800',
    INACTIVE: 'bg-slate-100 text-slate-600',
  }

  const labels: Record<StockStatus, string> = {
    IN_STOCK: 'In Stock',
    LOW_STOCK: 'Low Stock',
    OUT_OF_STOCK: 'Out of Stock',
    INACTIVE: 'Inactive',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[status]}`}
      data-testid={`admin-inventory-status-${status.toLowerCase()}`}
    >
      {labels[status]}
    </span>
  )
}

function InventorySkeleton() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-slate-100 animate-pulse">
          <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-6 w-24 bg-slate-200 rounded-full" /></td>
          <td className="px-4 py-4"><div className="h-8 w-24 bg-slate-200 rounded-lg" /></td>
        </tr>
      ))}
    </tbody>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <svg
        className="h-12 w-12 text-slate-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M8 10h12" />
        <path d="M8 14h12" />
        <path d="M8 18h12" />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No products available for inventory</h3>
      <p className="mt-2 text-slate-600">Add products from the Products page to manage inventory.</p>
    </div>
  )
}

interface StockFormData {
  stock: string
}

function StockEditForm({
  product,
  onSubmit,
  isSubmitting,
  onClose,
}: {
  product: Product
  onSubmit: (stock: number) => void
  isSubmitting: boolean
  onClose: () => void
}) {
  const [formData, setFormData] = useState<StockFormData>({ stock: String(product.stock) })
  const [error, setError] = useState<string | null>(null)

  const validateForm = () => {
    const stock = Number(formData.stock)
    if (!formData.stock || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      setError('Stock must be a non-negative integer')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) return
    onSubmit(Number(formData.stock))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-inventory-edit-stock-form">
      <div>
        <p className="text-sm text-slate-600">
          Current stock: <span className="font-medium text-slate-900">{product.stock}</span>
        </p>
        <p className="text-sm text-slate-600">
          Product: <span className="font-medium text-slate-900">{product.name}</span>
        </p>
      </div>
      <Field
        id="stock"
        label="New Stock Quantity *"
        type="number"
        value={formData.stock}
        onChange={(v) => setFormData({ stock: v })}
        placeholder="0"
        error={error ?? undefined}
        autoComplete="off"
      />
      {error && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          data-testid="admin-inventory-save-stock"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          {isSubmitting ? 'Saving…' : 'Save Stock'}
        </button>
      </div>
    </form>
  )
}

export function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stockFormOpen, setStockFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [filter, setFilter] = useState<StockStatus | 'ALL'>('ALL')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const productsData = await getAdminProducts({ limit: 100 })
      setProducts(productsData.items)
    } catch {
      setError('Unable to load inventory.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const filteredProducts = filter === 'ALL'
    ? products
    : products.filter((p) => getStockStatus(p) === filter)

  const stockCounts = products.reduce(
    (acc, p) => {
      const status = getStockStatus(p)
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<StockStatus, number>
  )

  const handleEditStock = (product: Product) => {
    setEditingProduct(product)
    setFormError(null)
    setStockFormOpen(true)
  }

  const handleFormSubmit = async (stock: number) => {
    if (!editingProduct) return
    setFormSubmitting(true)
    setFormError(null)
    try {
      const payload: UpdateProductInput = { stock }
      await updateProduct(editingProduct.id, payload)
      setSuccessMessage(`Stock updated for ${editingProduct.name}`)
      setStockFormOpen(false)
      setEditingProduct(null)
      void loadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to update stock.'
      setFormError(message)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleSuccessDismiss = () => setSuccessMessage(null)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 data-testid="admin-inventory-page" className="text-3xl font-bold tracking-tight text-slate-900">
              Inventory
            </h1>
            <p className="mt-1 text-slate-600">Monitor stock levels and availability</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as StockStatus | 'ALL')}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="Filter by stock status"
            >
              <option value="ALL">All</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Total Products</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{products.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">In Stock</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">{stockCounts.IN_STOCK || 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Low Stock</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">{stockCounts.LOW_STOCK || 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">Out of Stock</p>
            <p className="mt-1 text-2xl font-bold text-red-900">{stockCounts.OUT_OF_STOCK || 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">Inactive</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stockCounts.INACTIVE || 0}</p>
          </div>
        </div>

        {successMessage && (
          <div
            data-testid="success-toast"
            className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between"
            role="alert"
          >
            <p className="text-sm font-medium text-emerald-800">{successMessage}</p>
            <button
              type="button"
              onClick={handleSuccessDismiss}
              className="text-emerald-600 hover:text-emerald-800"
              aria-label="Dismiss"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stock Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <InventorySkeleton />
              </table>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12">
            <EmptyState />
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stock Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product)
                    return (
                      <tr
                        key={product.id}
                        data-testid="admin-inventory-row"
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <p data-testid="admin-inventory-product" className="font-medium text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-500 font-mono">{product.slug}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-600">{product.brand || '—'}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-600">{product.categoryName || '—'}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p data-testid="admin-inventory-price" className="font-medium text-slate-900">
                            {formatPrice(product.price)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <StockStatusBadge status={status} />
                            <span data-testid="admin-inventory-stock" className="font-mono text-sm font-medium text-slate-900">
                              {product.stock}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => handleEditStock(product)}
                            data-testid="admin-inventory-edit-stock"
                            aria-label={`Edit stock for ${product.name}`}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                          >
                            Edit Stock
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-slate-500">
          ShopSphere — E-Commerce System Under Test
        </div>
      </footer>

      <Modal
        isOpen={stockFormOpen}
        onClose={() => {
          setStockFormOpen(false)
          setEditingProduct(null)
          setFormError(null)
        }}
        title="Edit Stock"
        size="sm"
        action={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setStockFormOpen(false)
                setEditingProduct(null)
                setFormError(null)
              }}
              disabled={formSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {}}
              disabled={formSubmitting}
              data-testid="admin-inventory-save-stock"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              {formSubmitting ? 'Saving…' : 'Save Stock'}
            </button>
          </div>
        }
      >
        {formError && (
          <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}
        {editingProduct && (
          <StockEditForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            isSubmitting={formSubmitting}
            onClose={() => {
              setStockFormOpen(false)
              setEditingProduct(null)
              setFormError(null)
            }}
          />
        )}
      </Modal>
    </div>
  )
}