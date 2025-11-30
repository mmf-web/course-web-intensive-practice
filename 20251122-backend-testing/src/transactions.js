import express from 'express'

export class TransactionsController {
  constructor(db) {
    this.db = db
  }

  getRouter = () => {
    const router = express.Router()
    router.get('/', this.getAll)
    router.post('/', express.json(), this.createOne)
    router.patch('/:id', express.json(), this.updateOne)
    router.delete('/:id', this.deleteOne)
    return router
  }

  getAll = (req, res, next) => {
    const { type } = req.query
    switch (type) {
      case 'income':
        res.send(this.db.transactions.filter((t) => t.amount > 0))
        break
      case 'expense':
        res.send(this.db.transactions.filter((t) => t.amount < 0))
        break
      default:
        res.send(this.db.transactions)
        break
    }
  }

  createOne = (req, res, next) => {
    const transaction = {
      id: Date.now(), // TODO: date.now() cannot guarantee uniqueness
      ...req.body,
    }

    if (!transaction.amount) {
      return res.status(400).send('Amount is required')
    }

    this.db.transactions.push(transaction)

    res.sendStatus(201) // Created
  }

  updateOne = (req, res, next) => {
    const transaction = this.db.transactions.find((t) => t.id == req.params.id)
    if (!transaction) {
      return res.status(404).send('Transaction not found')
    }

    Object.assign(transaction, req.body)
    res.sendStatus(200) // OK
  }

  deleteOne = (req, res, next) => {
    const id = Number(req.params.id)
    if (isNaN(id) || !id) {
      return res.sendStatus(400) // Bad Request
    }

    const transaction = this.db.transactions.find((t) => t.id === id)
    if (!transaction) {
      return res.sendStatus(404) // Not Found
    }

    this.db.transactions = this.db.transactions.filter((t) => t.id !== Number(req.params.id))
    res.send(transaction) // OK
  }
}
