const express = require('express')
const { transactionModule } = require('./src/transactions')

const DB = {
  transactions: [],
}

const app = express()
transactionModule(app, DB)

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
