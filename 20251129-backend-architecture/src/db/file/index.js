import fs from 'node:fs/promises'

export class FileDB {
  #filePath = null

  constructor(filePath) {
    this.#filePath = filePath
  }

  createOne = async (transaction) => {
    const data = await fs.readFile(this.#filePath, 'utf8')
    const transactions = JSON.parse(data)
    transactions.push(transaction)
    await fs.writeFile(this.#filePath, JSON.stringify(transactions))
    return transaction
  }

  getAll = async ({ type } = {}) => {
    const transactions = JSON.parse(await fs.readFile(this.#filePath, 'utf8'))

    if (type === 'income') {
      transactions = transactions.filter((t) => t.amount > 0)
    } else if (type === 'expense') {
      transactions = transactions.filter((t) => t.amount < 0)
    }

    return transactions
  }

  deleteOne = async (id) => {
    let transactions = JSON.parse(await fs.readFile(this.#filePath, 'utf8'))

    const transaction = transactions.find((t) => t.id === id)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    transactions = transactions.filter((t) => t.id !== id)
    await fs.writeFile(this.#filePath, JSON.stringify(transactions))

    return transaction
  }
}
