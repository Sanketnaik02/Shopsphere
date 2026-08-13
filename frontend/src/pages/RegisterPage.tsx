import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/use-auth'
import { Field, FieldError } from '../components/Field'
import { ApiError } from '../lib/api'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage() {
  const { register, status } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setApiError(null)

    const errors: { name?: string; email?: string; password?: string } = {}
    if (!name.trim()) {
      errors.name = 'Name is required.'
    }
    if (!EMAIL_PATTERN.test(email)) {
      errors.email = 'Enter a valid email address.'
    }
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.'
    }
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      await register(name, email, password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12">
      <Link to="/" className="mb-6 flex items-center gap-2">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white"
          aria-hidden="true"
        >
          S
        </span>
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          ShopSphere
        </span>
      </Link>

      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Join ShopSphere to get started.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <Field
            id="name"
            label="Full name"
            value={name}
            onChange={setName}
            autoComplete="name"
            placeholder="Sanket"
            error={fieldErrors.name}
          />
          <Field
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@example.com"
            error={fieldErrors.email}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            error={fieldErrors.password}
          />
          <p className="text-xs text-slate-500">
            Must be at least 8 characters.
          </p>

          {apiError ? <FieldError>{apiError}</FieldError> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}