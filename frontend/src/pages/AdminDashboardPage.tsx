import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

interface AdminModule {
  title: string
  description: string
  href: string
  action: string
  icon: React.ReactNode
  testId: string
  comingSoon: boolean
}

function IconProducts() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconCategories() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  )
}

function IconOrders() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconInventory() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 10h12" />
      <path d="M8 14h12" />
      <path d="M8 18h12" />
    </svg>
  )
}

const adminModules: AdminModule[] = [
  {
    title: 'Products',
    description: 'Create, edit and deactivate catalog products.',
    href: '/admin/products',
    action: 'Manage Products',
    icon: <IconProducts />,
    testId: 'admin-products-link',
    comingSoon: true,
  },
  {
    title: 'Categories',
    description: 'Manage product categories and availability.',
    href: '/admin/categories',
    action: 'Manage Categories',
    icon: <IconCategories />,
    testId: 'admin-categories-link',
    comingSoon: true,
  },
  {
    title: 'Orders',
    description: 'Review customer orders and update order status.',
    href: '/admin/orders',
    action: 'Manage Orders',
    icon: <IconOrders />,
    testId: 'admin-orders-link',
    comingSoon: true,
  },
  {
    title: 'Inventory',
    description: 'Monitor stock levels and availability.',
    href: '/admin/inventory',
    action: 'Manage Inventory',
    icon: <IconInventory />,
    testId: 'admin-inventory-link',
    comingSoon: true,
  },
]

export function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 id="admin-heading" data-testid="admin-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl">
            Manage ShopSphere products, categories, orders and inventory.
          </p>
          <span
            data-testid="admin-badge"
            className="mt-4 inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white"
          >
            ADMIN
          </span>
        </header>

        <section aria-labelledby="quick-actions-heading" className="w-full">
          <h2 id="quick-actions-heading" className="sr-only">
            Quick Actions
          </h2>
          <div
            data-testid="admin-dashboard"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {adminModules.map((module) => (
              <article
                key={module.title}
                data-testid="admin-module-card"
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  {module.icon}
                </div>
                <div className="mt-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{module.description}</p>
                </div>
                {module.comingSoon ? (
                  <button
                    type="button"
                    disabled
                    className="mt-6 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed"
                    aria-disabled="true"
                  >
                    {module.action} — Coming Soon
                  </button>
                ) : (
                  <Link
                    to={module.href}
                    data-testid={module.testId}
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                  >
                    {module.action}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-slate-500">
          ShopSphere — E-Commerce System Under Test
        </div>
      </footer>
    </div>
  )
}