import { Link } from 'react-router-dom'
import { useAuth } from '../context/use-auth'

export function HomePage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav
          className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white"
              aria-hidden="true"
            >
              S
            </span>
            <span className="text-lg font-semibold tracking-tight">ShopSphere</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
              Phase 2
            </span>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">ShopSphere</h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          E-Commerce System Under Test
        </p>
        <p className="mt-6 text-slate-500">
          {user ? (
            <>
              Welcome back, <span className="font-medium text-slate-700">{user.name}</span>.
            </>
          ) : (
            'Create an account or log in to continue.'
          )}
        </p>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-slate-500">
          ShopSphere — E-Commerce System Under Test
        </div>
      </footer>
    </div>
  )
}