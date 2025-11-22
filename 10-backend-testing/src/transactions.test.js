import { test, describe, beforeEach, before, afterEach, after } from 'node:test'
import { TransactionsController } from './transactions.js'

describe('TransactionsController', () => {
  describe('#deleteOne', () => {
    test('should delete a transaction', (t) => {
      // Arrange
      const db = { transactions: [{ id: 1 }, { id: 2 }] }
      const controller = new TransactionsController(db)
      const req = { params: { id: 1 } }
      let sentTransaction = null
      const res = { send: (transaction) => (sentTransaction = transaction) }

      // Act
      controller.deleteOne(req, res)

      // Assert
      t.assert.strictEqual(db.transactions.length, 1, 'should delete the transaction')
      t.assert.strictEqual(db.transactions[0].id, 2, 'should keep the other transaction')
      t.assert.deepStrictEqual(sentTransaction, { id: 1 }, 'should send deleted transaction')
    })

    test('should delete a transaction (mocked)', (t) => {
      // Arrange
      const db = { transactions: [{ id: 1 }, { id: 2 }] }
      const controller = new TransactionsController(db)
      const req = { params: { id: 1 } }
      const res = { send: t.mock.fn() }

      // Act
      controller.deleteOne(req, res)

      // Assert
      t.assert.strictEqual(db.transactions.length, 1, 'should delete the transaction')
      t.assert.strictEqual(db.transactions[0].id, 2, 'should keep the other transaction')
      t.assert.strictEqual(res.send.mock.calls.length, 1, 'should send deleted transaction')
      t.assert.deepStrictEqual(res.send.mock.calls[0].arguments[0], { id: 1 }, 'should send deleted transaction')
    })

    // Table inside
    test('should accept invalid ids and not remove anything', (t) => {
      for (const id of ['2', 2, 'asidfa', '123', 123.45, 'NaN', 'Infinity', '-Infinity', '', null, undefined]) {
        const db = { transactions: [{ id: 1 }] }
        const controller = new TransactionsController(db)
        const req = { params: { id } }
        const res = { sendStatus: t.mock.fn() }

        controller.deleteOne(req, res)

        t.assert.deepStrictEqual(db.transactions, [{ id: 1 }], `should not remove anything: ${id}`)
      }
    })

    // Table-driven test
    ;['2', 2, 'asidfa', '123', 123.45, 'NaN', 'Infinity', '-Infinity', '', null, undefined].forEach((id) => {
      test(`should not remove transaction when passed invalid id: ${id}`, (t) => {
        const db = { transactions: [{ id: 1 }] }
        const controller = new TransactionsController(db)
        const req = { params: { id } }
        const res = { sendStatus: t.mock.fn() }

        controller.deleteOne(req, res)

        t.assert.deepStrictEqual(db.transactions, [{ id: 1 }], `should not remove anything: ${id}`)
      })
    })
  })
})
