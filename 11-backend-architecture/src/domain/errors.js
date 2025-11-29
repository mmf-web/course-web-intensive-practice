export class NotFoundError extends Error {
  constructor(message, cause) {
    super(message)
    this.name = 'NotFoundError'
    this.cause = cause
  }
}
