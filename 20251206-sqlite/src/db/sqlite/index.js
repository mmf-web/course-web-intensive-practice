import fs from 'node:fs/promises'
import { Database } from 'sqlite-async'
import { CREATE_TRANSACTIONS_TABLE_0 } from './migrations.js'

export class Sqlite {
  #filePath = null
  #db = null

  constructor(filePath) {
    this.#filePath = filePath
  }

  connectAndMigrate = async () => {
    this.#db = await Database.open(this.#filePath)

    console.log('Connected to SQLite database, running migrations...')
    await this.#db.exec(CREATE_TRANSACTIONS_TABLE_0)
    console.log('Migrations completed')
  }

  close = async () => this.#db.close()

  createOne = async (transaction) => {
    return await this.#db.get(
      `
      INSERT INTO transactions (amount) VALUES ($1)
      RETURNING *
      `,
      [transaction.amount]
    )
  }

  getById = async (id) => {
    const transaction = await this.#db.get(
      `
      SELECT * FROM transactions WHERE id = ?
      `,
      [id]
    )
    return transaction
  }

  getAll = async ({ type } = {}) => {
    let query = `SELECT * FROM transactions WHERE TRUE`
    const params = []

    if (type === 'income') {
      query += ` AND amount > 0`
    } else if (type === 'expense') {
      query += ` AND amount < 0`
    }

    return await this.#db.all(query, params)
  }

  deleteOne = async (id) => {
    return await this.#db.get(
      `
      DELETE FROM transactions WHERE id = $1
      RETURNING *
      `,
      [id]
    )
  }
}
