import { Link, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export function AccessDeniedPage() {
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div data-testid="access-denied" className="w-full">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Access Denied</h1>
          <p className="mt-4 text-lg text-slate-600">
            You do not have permission to access the admin area.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to={from && from !== '/access-denied' ? from : '/dashboard'}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-slate-500">
          ShopSphere — E-Commerce System Under Test
        </div>
      </footer>
    </div>
  )
}