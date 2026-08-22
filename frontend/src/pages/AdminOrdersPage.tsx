import { Navbar } from '../components/Navbar'

export function AdminOrdersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 data-testid="admin-orders-page" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Orders
          </h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl">
            Review customer orders and update order status
          </p>
        </header>

        <section aria-labelledby="backend-limitation-heading" className="w-full">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="h-6 w-6 text-amber-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 id="backend-limitation-heading" className="text-lg font-semibold text-amber-900">
                  Backend Support Required
                </h2>
                <p className="mt-2 text-amber-800">
                  The current backend does not provide admin-wide order management endpoints.
                </p>
                <div className="mt-4 space-y-2 text-sm text-amber-800">
                  <p>
                    <strong>Missing endpoints:</strong>
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>Admin listing of all customer orders (GET /api/admin/orders)</li>
                    <li>Admin viewing of any order by ID (GET /api/admin/orders/:id)</li>
                    <li>Admin updating order status (PATCH /api/admin/orders/:id/status)</li>
                  </ul>
                </div>
                <div className="mt-4 text-sm text-amber-800">
                  <p>
                    <strong>Current backend contract:</strong> The existing order endpoints (
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">
                      GET /api/orders
                    </code>
                    ,
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">
                      GET /api/orders/:id
                    </code>
                    ,
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">
                      POST /api/orders/:id/cancel
                    </code>
                    ) are customer-scoped — they only return or modify orders belonging to the authenticated user.
                  </p>
                </div>
                <div className="mt-4 text-sm text-amber-800">
                  <p>
                    <strong>Security note:</strong> This frontend does not and will not misuse the customer
                    endpoint to access other users' orders. Backend authorization remains the authoritative
                    security boundary.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8">
            <h3 className="text-lg font-semibold text-slate-900">Available Customer Order Features</h3>
            <p className="mt-2 text-slate-600">
              As an admin, you can still use the standard customer order features for your own account:
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-sm text-slate-600">
              <li>View your own order history: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">/orders</code></li>
              <li>View your own order details: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">/orders/:id</code></li>
              <li>Cancel your own confirmed orders</li>
            </ul>
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