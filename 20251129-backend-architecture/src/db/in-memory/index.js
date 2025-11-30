import { NotFoundError } from '../../domain/errors.js'

export class InMemoryDB {
  #transactions = []

  createOne = async (transaction) => {
    this.#transactions.push(transaction)
    return transaction
  }

  getAll = async ({ type } = {}) => {
    const transactions = [...this.#transactions]

    if (type === 'income') {
      transactions = transactions.filter((t) => t.amount > 0)
    } else if (type === 'expense') {
      transactions = transactions.filter((t) => t.amount < 0)
    }

    return transactions
  }

  deleteOne = async (id) => {
    const transaction = this.#transactions.find((t) => t.id === id)
    if (!transaction) {
      throw new NotFoundError('Transaction not found')
    }

    this.#transactions = this.#transactions.filter((t) => t.id !== id)
    return transaction
  }
}
