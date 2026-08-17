import { ApiError } from '../lib/api'

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.message) {
    return error.message
  }
  return fallback
}