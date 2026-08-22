import { useCallback, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Field } from '../components/Field'
import { Textarea } from '../components/Textarea'
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '../api/admin-categories'
import type { Category } from '../types/category'

interface AdminCategoryRowProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

function CategoryStatusBadge({ isActive }: { isActive: boolean }) {
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

function AdminCategoryRow({ category, onEdit, onDelete }: AdminCategoryRowProps) {
  return (
    <tr data-testid="admin-category-row" className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-4 py-4">
        <p data-testid="admin-category-name" className="font-medium text-slate-900">
          {category.name}
        </p>
        <p className="text-sm text-slate-500 font-mono">{category.slug}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600 max-w-xs truncate">
          {category.description || '—'}
        </p>
      </td>
      <td className="px-4 py-4">
        <CategoryStatusBadge isActive={category.isActive} />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(category)}
            data-testid="admin-edit-category"
            aria-label={`Edit category ${category.name}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            data-testid="admin-deactivate-category"
            aria-label={`Deactivate category ${category.name}`}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            Deactivate
          </button>
        </div>
      </td>
    </tr>
  )
}

function CategorySkeleton() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-slate-100 animate-pulse">
          <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
          <td className="px-4 py-4"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
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
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No categories available</h3>
      <p className="mt-2 text-slate-600">Get started by adding your first category.</p>
    </div>
  )
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
}

const initialCategoryFormData: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
}

function CategoryForm({
  initialData,
  onSubmit,
  isSubmitting,
  onClose,
}: {
  initialData?: Category
  onSubmit: (data: CreateCategoryInput | UpdateCategoryInput) => void
  isSubmitting: boolean
  onClose: () => void
}) {
  const [formData, setFormData] = useState<CategoryFormData>(() => {
    if (initialData) {
      return {
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || '',
      }
    }
    return initialCategoryFormData
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) return

    const payload: CreateCategoryInput | UpdateCategoryInput = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || undefined,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-category-form">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="name"
          label="Name *"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          placeholder="Category name"
          error={errors.name}
          autoComplete="off"
        />
        <Field
          id="slug"
          label="Slug *"
          value={formData.slug}
          onChange={(v) => setFormData({ ...formData, slug: v })}
          placeholder="category-slug"
          error={errors.slug}
          autoComplete="off"
        />
        <div className="sm:col-span-2">
          <Textarea
            id="description"
            label="Description"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            placeholder="Category description"
            rows={4}
          />
        </div>
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
          data-testid="admin-category-save"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          {isSubmitting ? 'Saving…' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  )
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const categoriesData = await getAdminCategories()
      setCategories(categoriesData)
    } catch {
      setError('Unable to load categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleAddCategory = () => {
    setEditingCategory(null)
    setFormError(null)
    setFormOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormError(null)
    setFormOpen(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    setFormSubmitting(true)
    setFormError(null)
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data as UpdateCategoryInput)
        setSuccessMessage('Category updated successfully')
      } else {
        await createCategory(data as CreateCategoryInput)
        setSuccessMessage('Category created successfully')
      }
      setFormOpen(false)
      setEditingCategory(null)
      void loadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save category.'
      setFormError(message)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return
    setDeleting(true)
    try {
      await deleteCategory(categoryToDelete.id)
      setSuccessMessage('Category deactivated successfully')
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      void loadData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to deactivate category.'
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
            <h1 data-testid="admin-categories-page" className="text-3xl font-bold tracking-tight text-slate-900">
              Categories
            </h1>
            <p className="mt-1 text-slate-600">Manage product categories and availability</p>
          </div>
          <button
            type="button"
            onClick={handleAddCategory}
            data-testid="admin-add-category"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Category
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
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <CategorySkeleton />
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
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12">
            <EmptyState />
            <button
              onClick={handleAddCategory}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              Add Category
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <AdminCategoryRow
                      key={category.id}
                      category={category}
                      onEdit={handleEditCategory}
                      onDelete={handleDeleteCategory}
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
          setEditingCategory(null)
          setFormError(null)
        }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="md"
        action={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormOpen(false)
                setEditingCategory(null)
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
              data-testid="admin-category-save"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              {formSubmitting ? 'Saving…' : editingCategory ? 'Update Category' : 'Create Category'}
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
        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={handleFormSubmit}
          isSubmitting={formSubmitting}
          onClose={() => {
            setFormOpen(false)
            setEditingCategory(null)
            setFormError(null)
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setCategoryToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Deactivate Category"
        message={categoryToDelete
          ? `This category will be deactivated. ${categoryToDelete.isActive ? 'Products in this category will no longer be visible in the active catalog.' : 'This category is already inactive.'} Are you sure?`
          : 'Are you sure you want to deactivate this category?'}
        confirmText="Deactivate"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  )
}