const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'

const TOKEN_KEY = 'shopsphere_token'

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  message?: string
  errorCode?: string
}

export class ApiError extends Error {
  statusCode: number
  errorCode?: string

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errorCode = errorCode
  }
}

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError(
      'Unable to reach the server. Please try again.',
      0,
      'NETWORK_ERROR',
    )
  }

  let envelope: ApiEnvelope<T> | null = null
  try {
    envelope = (await response.json()) as ApiEnvelope<T>
  } catch {
    envelope = null
  }

  if (!response.ok) {
    throw new ApiError(
      envelope?.message ?? 'Request failed',
      response.status,
      envelope?.errorCode,
    )
  }

  if (!envelope?.data) {
    return envelope as unknown as T
  }

  return envelope.data
}