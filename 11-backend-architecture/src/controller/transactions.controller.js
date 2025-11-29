import express from 'express'
import { NotFoundError } from '../domain/errors.js'

export class TransactionsController {
  constructor(transactionsService) {
    this.transactions = transactionsService
  }

  getRouter = () => {
    const router = express.Router()
    router.get('/', this.getAll)
    router.delete('/:id', this.deleteOne)
    return router
  }

  getAll = async (req, res, next) => {
    const { type } = req.query
    const transactions = await this.transactions.getAll({ type })
    res.send(transactions)
  }

  deleteOne = async (req, res, next) => {
    try {
      const id = req.params.id
      const transaction = await this.transactions.deleteOne(id)
      res.json({
        data: transaction,
        error: null,
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).send(error.message)
      } else {
        res.status(500).send(error.message)
      }
    }
  }
}
