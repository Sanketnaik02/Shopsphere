import { useCallback, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Field } from '../components/Field'
import { Textarea } from '../components/Textarea'
import { Select } from '../components/Select'
import { formatPrice } from '../utils/currency'
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type CreateProductInput,
  type UpdateProductInput,
} from '../api/admin-products'
import { getAdminCategories } from '../api/admin-categories'
import type { Product } from '../types/product'
import type { Category } from '../types/category'

interface AdminProductRowProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-slate-100 text-slate-600'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

function ProductImage({ url, alt }: { url: string | null; alt: string }) {
  if (!url) {
    return (
      <div
        aria-hidden="true"
        className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center"
      >
        <svg className="h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    )
  }
  return (
    <img
      src={url}
      alt={alt}
      className="h-16 w-16 rounded-lg object-cover"
      loading="lazy"
    />
  )
}

function AdminProductRow({ product, onEdit, onDelete }: AdminProductRowProps) {
  return (
    <tr data-testid="admin-product-row" className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-4 py-4">
        <ProductImage url={product.imageUrl} alt={product.name} />
      </td>
      <td className="px-4 py-4">
        <p data-testid="admin-product-name" className="font-medium text-slate-900">
          {product.name}
        </p>
        <p className="text-sm text-slate-500 font-mono">{product.slug}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600">{product.categoryName || '—'}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600">{product.brand || '—'}</p>
      </td>
      <td className="px-4 py-4">
        <p data-testid="admin-product-price" className="font-medium text-slate-900">
          {formatPrice(product.price)}
        </p>
      </td>
      <td className="px-4 py-4">
        <p data-testid="admin-product-stock" className="font-medium text-slate-900">
          {product.stock}
        </p>
      </td>
      <td className="px-4 py-4">
        <ProductStatusBadge isActive={product.isActive} />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            data-testid="admin-edit-product"
            aria-label={`Edit product ${product.name}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            data-testid="admin-deactivate-product"
            aria-label={`Deactivate product ${product.name}`}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            Deactivate
          </button>
        </div>
      </td>
    </tr>
  )
}

function ProductSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-slate-100 animate-pulse">
          <td className="px-4 py-4"><div className="h-16 w-16 rounded-lg bg-slate-200" /></td>
          <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-200 rounded-full" /></td>
          <td className="px-4 py-4"><div className="h-8 w-20 bg-slate-200 rounded-lg" /></td>
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
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No products available</h3>
      <p className="mt-2 text-slate-600">Get started by adding your first product.</p>
    </div>
  )
}

interface ProductFormData {
  name: string
  slug: string
  description: string
  price: string
  categoryId: string
  brand: string
  imageUrl: string
  stock: string
  rating: string
}

const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  categoryId: '',
  brand: '',
  imageUrl: '',
  stock: '0',
  rating: '0',
}

function ProductForm({
  categories,
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}: {
  categories: Category[]
  initialData?: Product
  onSubmit: (data: CreateProductInput | UpdateProductInput) => void
  isSubmitting: boolean
  onClose: () => void
}) {
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (initialData) {
      return {
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || '',
        price: String(initialData.price),
        categoryId: initialData.categoryName ? '' : '', // We'll need to map this
        brand: initialData.brand || '',
        imageUrl: initialData.imageUrl || '',
        stock: String(initialData.stock),
        rating: String(initialData.rating || 0),
      }
    }
    return initialFormData
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.price || Number(formData.price) < 0) newErrors.price = 'Price must be >= 0'
    if (!formData.categoryId) newErrors.categoryId = 'Category is required'
    if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = 'Stock must be >= 0'
    if (formData.rating && (Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) return

    const payload: CreateProductInput | UpdateProductInput = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || undefined,
      price: Number(formData.price),
      categoryId: formData.categoryId,
      brand: formData.brand.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      stock: Number(formData.stock),
      rating: formData.rating ? Number(formData.rating) : undefined,
    }
    onSubmit(payload)
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-product-form">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="name"
          label="Name *"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          placeholder="Product name"
          error={errors.name}
          autoComplete="off"
        />
        <Field
          id="slug"
          label="Slug *"
          value={formData.slug}
          onChange={(v) => setFormData({ ...formData, slug: v })}
          placeholder="product-slug"
          error={errors.slug}
          autoComplete="off"
        />
        <div className="sm:col-span-2">
          <Textarea
            id="description"
            label="Description"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            placeholder="Product description"
            rows={4}
          />
        </div>
        <Field
          id="price"
          label="Price (paise) *"
          type="number"
          value={formData.price}
          onChange={(v) => setFormData({ ...formData, price: v })}
          placeholder="99900"
          error={errors.price}
          autoComplete="off"
        />
        <Select
          id="categoryId"
          label="Category *"
          value={formData.categoryId}
          onChange={(v) => setFormData({ ...formData, categoryId: v })}
          options={categoryOptions}
          placeholder="Select category"
          error={errors.categoryId}
        />
        <Field
          id="brand"
          label="Brand"
          value={formData.brand}
          onChange={(v) => setFormData({ ...formData, brand: v })}
          placeholder="Brand name"
          autoComplete="off"
        />
        <Field
          id="imageUrl"
          label="Image URL"
          value={formData.imageUrl}
          onChange={(v) => setFormData({ ...formData, imageUrl: v })}
          placeholder="https://example.com/image.jpg"
          autoComplete="url"
        />
        <Field
          id="stock"
          label="Stock *"
          type="number"
          value={formData.stock}
          onChange={(v) => setFormData({ ...formData, stock: v })}
          placeholder="0"
          error={errors.stock}
          autoComplete="off"
        />
        <Field
          id="rating"
          label="Rating (0-5)"
          type="number"
          value={formData.rating}
          onChange={(v) => setFormData({ ...formData, rating: v })}
          placeholder="0"
          error={errors.rating}
          autoComplete="off"
        />
      </div>
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
          data-testid="admin-product-save"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          {isSubmitting ? 'Saving…' : initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAdminProducts({ limit: 50 }),
        getAdminCategories(),
      ])
      setProducts(productsData.items)
      setCategories(categoriesData)
    } catch {
      setError('Unable to load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormError(null)
    setFormOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormError(null)
    setFormOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: CreateProductInput | UpdateProductInput) => {
    setFormSubmitting(true)
    setFormError(null)
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data as UpdateProductInput)
        setSuccessMessage('Product updated successfully')
      } else {
        await createProduct(data as CreateProductInput)
        setSuccessMessage('Product created successfully')
      }
      setFormOpen(false)
      setEditingProduct(null)
      void loadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save product.'
      setFormError(message)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    setDeleting(true)
    try {
      await deleteProduct(productToDelete.id)
      setSuccessMessage('Product deactivated successfully')
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      void loadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to deactivate product.'
      setFormError(message)
    } finally {
      setDeleting(false)
    }
  }

  const handleSuccessDismiss = () => setSuccessMessage(null)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 data-testid="admin-products-page" className="text-3xl font-bold tracking-tight text-slate-900">
              Products
            </h1>
            <p className="mt-1 text-slate-600">Manage catalog products</p>
          </div>
          <button
            type="button"
            onClick={handleAddProduct}
            data-testid="admin-add-product"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </header>

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
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <ProductSkeleton />
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
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12">
            <EmptyState />
            <button
              onClick={handleAddProduct}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <AdminProductRow
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
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
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingProduct(null)
          setFormError(null)
        }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
        action={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormOpen(false)
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
              onClick={() => {
                // Form submission is handled by the form's onSubmit
              }}
              disabled={formSubmitting}
              data-testid="admin-product-save"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              {formSubmitting ? 'Saving…' : editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        }
      >
        {formError && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {formError}
          </div>
        )}
        <ProductForm
          categories={categories}
          initialData={editingProduct || undefined}
          onSubmit={handleFormSubmit}
          isSubmitting={formSubmitting}
          onClose={() => {
            setFormOpen(false)
            setEditingProduct(null)
            setFormError(null)
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setProductToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Deactivate Product"
        message={`This product will no longer be visible in the active customer catalog. Are you sure you want to deactivate "${productToDelete?.name}"?`}
        confirmText="Deactivate"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  )
}