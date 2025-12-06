import { test, describe, beforeEach, before, afterEach, after } from 'node:test'
import { Sqlite } from './index.js'
import fs from 'node:fs/promises'

describe('Sqlite DB', () => {
  const name = Date.now() + '.db'
  let db = null

  beforeEach(async (t) => {
    db = new Sqlite(name)
    await db.connectAndMigrate()
  })

  afterEach(async (t) => {
    await db.close()
    await fs.unlink(name)
  })

  describe('createOne', () => {
    test('creates a transaction', async (t) => {
      const transaction = { amount: 100 }

      const result = await db.createOne(transaction)
      const created = await db.getById(result.id)

      t.assert.equal(result.amount, transaction.amount, 'should create a transaction')
      t.assert.equal(created.amount, transaction.amount, 'should get the created transaction')
    })
  })
})
