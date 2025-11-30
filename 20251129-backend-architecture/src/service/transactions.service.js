import { NotFoundError } from '../domain/errors.js'

export class TransactionsService {
  constructor(db) {
    this.db = db
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
      throw new Error('Invalid id')
    }
    return id
  }
}
