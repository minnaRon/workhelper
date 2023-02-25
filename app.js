const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('express-async-errors')

if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}
//app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))



module.exports = app
