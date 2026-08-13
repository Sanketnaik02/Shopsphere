import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiRequest, getToken, setToken } from '../lib/api'
import { AuthContext } from './auth-context'
import type { AuthStatus } from './auth-context'
import type { AuthResponse, User } from '../types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    if (!getToken()) {
      setStatus('unauthenticated')
      return
    }

    let active = true

    apiRequest<{ user: User }>('/auth/me')
      .then((data) => {
        if (!active) return
        setUser(data.user)
        setStatus('authenticated')
      })
      .catch(() => {
        if (!active) return
        setToken(null)
        setUser(null)
        setStatus('unauthenticated')
      })

    return () => {
      active = false
    }
  }, [])

  const login = async (email: string, password: string) => {
    const data = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setToken(data.token)
    setUser(data.user)
    setStatus('authenticated')
  }

  const register = async (name: string, email: string, password: string) => {
    const data = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    setToken(data.token)
    setUser(data.user)
    setStatus('authenticated')
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setStatus('unauthenticated')
  }

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}