import express from 'express'
import { TransactionsController } from './src/controller/transactions.controller.js'
import { InMemoryDB } from './src/db/in-memory/index.js'
import { FileDB } from './src/db/file/index.js'
import { TransactionsService } from './src/service/transactions.service.js'

const inMemDB = new InMemoryDB()
inMemDB.createOne({ id: 1, amount: 100 })
const fileDB = new FileDB('./db.json')

const transactionsService = new TransactionsService(fileDB)
const transactionsController = new TransactionsController(transactionsService)

const app = express()

app.use('/transactions', transactionsController.getRouter())

// Example of multiple middlewares
// app.get(
//   '/hello',
//   (req, res, next) => {
//     if (req.query.name) {
//       next()
//     } else {
//       res.status(400).send('Name is required')
//     }
//   },
//   (req, res, next) => res.send(`Hello, ${req.query.name}!`)
// )

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
