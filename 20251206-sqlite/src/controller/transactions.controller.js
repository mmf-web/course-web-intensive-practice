import express from 'express'
import { NotFoundError, ValidationError } from '../domain/errors.js'

export class TransactionsController {
  constructor(transactionsService) {
    this.transactions = transactionsService
  }

  // TODO: move down
  #handle = (handler) => {
    return async (req, res, next) => {
      try {
        await handler(req, res, next)
      } catch (error) {
        if (error instanceof ValidationError) {
          res.status(400).send(error.message)
        } else {
          res.status(500).send(error.message)
        }
      }
    }
  }

  getRouter = () => {
    const router = express.Router()
    router.get('/', this.getAll)
    router.post('/', express.json(), this.createOne)
    router.delete('/:id', this.deleteOne)
    return router
  }

  createOne = this.#handle(async (req, res, next) => {
    // TODO: transaction date can be passed as body param
    const transaction = await this.transactions.createOne({ amount: req.body.amount })
    res.send(transaction)
  })

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
