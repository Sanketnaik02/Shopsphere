import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/use-auth'

export function AdminRoute() {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <p aria-live="polite">Loading your session…</p>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/access-denied" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}