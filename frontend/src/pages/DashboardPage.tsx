import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/use-auth'
import { Navbar } from '../components/Navbar'

export function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to ShopSphere</h1>
        <p className="mt-2 text-lg text-slate-600">
          You are signed in as <span className="font-medium text-slate-900">{user.name}</span>.
        </p>
        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <dt className="text-sm text-slate-500">Name</dt>
            <dd className="mt-1 font-medium text-slate-900">{user.name}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <dt className="text-sm text-slate-500">Email</dt>
            <dd className="mt-1 font-medium text-slate-900">{user.email}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <dt className="text-sm text-slate-500">Role</dt>
            <dd className="mt-1 font-medium text-slate-900">{user.role}</dd>
          </div>
        </dl>
        <p className="mt-8 text-sm text-slate-500">
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-700">
            Back to home
          </Link>
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