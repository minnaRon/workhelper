/**
 * Module, app
 * @description Determines used libraries, middlewares, paths to routers, requestlogger.
 * Connects to the database.
 * Exports app
*/
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('express-async-errors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const countriesRouter = require('./controllers/countries')
const vocabulariesRouter = require('./controllers/vocabularies')
const languagesRouter = require('./controllers/languages')
const worksRouter = require('./controllers/works')

logger.info('connecting to MongoDB')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  }).catch((error) => {
    logger.error('error connecting to MongoDB', error.message)
  })

if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}
app.use(express.static('build'))
app.use(express.json())

if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'))
}

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/countries', countriesRouter)
app.use('/api/vocabularies', vocabulariesRouter)
app.use('/api/languages', languagesRouter)
app.use('/api/works', middleware.userExtractor, worksRouter)

if(process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
