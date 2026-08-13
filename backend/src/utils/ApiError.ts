export class ApiError extends Error {
  statusCode: number
  isOperational: boolean
  errorCode?: string

  constructor(statusCode: number, message: string, isOperational = true, errorCode?: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errorCode = errorCode
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
