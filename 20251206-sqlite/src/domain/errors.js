export class NotFoundError extends Error {
  constructor(message, cause) {
    super(message)
    this.name = 'NotFoundError'
    this.cause = cause
  }
}

export class ValidationError extends Error {
  constructor(message, cause) {
    super(message)
    this.name = 'ValidationError'
    this.cause = cause
  }
}
