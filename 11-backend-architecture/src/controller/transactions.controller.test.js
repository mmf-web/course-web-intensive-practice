import { test, describe } from 'node:test'
import { TransactionsController } from './transactions.controller.js'
import request from 'supertest'
import express from 'express'

describe('TransactionsController', () => {
  describe('DELETE /:id', () => {
    test('deletes a transaction', async (t) => {
      // Arrange
      const expectedTransaction = { id: 1 }
      const service = { deleteOne: async () => expectedTransaction }
      const app = express()
      app.use('/', new TransactionsController(service).getRouter())

      // Act
      await request(app).delete('/1').expect(200).expect({ data: expectedTransaction, error: null })
    })
  })
})
