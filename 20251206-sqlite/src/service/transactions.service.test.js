import { test, describe, beforeEach, before, afterEach, after } from 'node:test'
import { TransactionsService } from './transactions.service.js'

describe('TransactionsService', () => {
  describe('#deleteOne', () => {
    test('does not fail when valid id is passed', async (t) => {
      // Arrange
      const db = { deleteOne: t.mock.fn() }
      const service = new TransactionsService(db)
      const id = 1

      // Act
      await service.deleteOne(id)
    })

    test('fails when invalid id is passed', async (t) => {
      // Arrange
      const db = { deleteOne: t.mock.fn() }
      const service = new TransactionsService(db)
      const id = 'invalid'

      // Act
      await t.assert.rejects(service.deleteOne(id))
    })
  })
})
