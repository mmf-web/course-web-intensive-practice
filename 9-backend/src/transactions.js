const express = require('express')

exports.transactionModule = (app, DB) => {
  app.get('/transactions', (req, res, next) => {
    const { type } = req.query
    switch (type) {
      case 'income':
        res.send(DB.transactions.filter((t) => t.amount > 0))
        break
      case 'expence':
        res.send(DB.transactions.filter((t) => t.amount < 0))
        break
      default:
        res.send(DB.transactions)
        break
    }
  })
  app.post('/transactions', express.json(), (req, res, next) => {
    const transaction = {
      id: Date.now(), // TODO: date.now() cannot guarantee uniqueness
      ...req.body,
    }

    if (!transaction.amount) {
      return res.status(400).send('Amount is required')
    }

    DB.transactions.push(transaction)

    res.sendStatus(201) // Created
  })

  app.patch('/transactions/:id', express.json(), (req, res, next) => {
    const transaction = DB.transactions.find((t) => t.id == req.params.id)
    if (!transaction) {
      return res.status(404).send('Transaction not found')
    }

    Object.assign(transaction, req.body)
    res.sendStatus(200) // OK
  })
  app.delete('/transactions/:id', (req, res, next) => {
    DB.transactions = DB.transactions.filter((t) => t.id != req.params.id)
    res.sendStatus(200) // OK
  })
}
