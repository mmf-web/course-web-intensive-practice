import { NotFoundError, ValidationError } from '../domain/errors.js'

export class TransactionsService {
  constructor(db) {
    this.db = db
  }

  createOne = async (transaction) => {
    if (!transaction.amount) {
      throw new ValidationError('Amount is required')
    }

    return await this.db.createOne(transaction)
  }

  getAll = async ({ type } = {}) => {
    return await this.db.getAll({ type })
  }

  deleteOne = async (id) => {
    const validId = this.#validateId(id)
    return await this.db.deleteOne(validId)
  }

  #validateId = (id) => {
    id = Number(id)
    if (isNaN(id) || id <= 0) {
      throw new ValidationError('Invalid id')
    }
    return id
  }
}
