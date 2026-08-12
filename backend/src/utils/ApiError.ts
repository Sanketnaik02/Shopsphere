export class ApiError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.isOperational = isOperational
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
