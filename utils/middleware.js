/**
 * Module, middleware
 * @description Handles requests and responses as wanted.
 * Exports as object functions unknownEndpoint, errorHandler
*/
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * Function unknownEndpoint
 * @description Responses if the router doesn't have listener
 * to the path in the request.
 * @returns error message object with status 404
 */
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

/**
 * Function errorHandler
 * @description Responses if the request has some error preventing
 * correct handling.
 * @returns error message object with error status
 */
const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const userExtractor = async (req, res, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
    if (decodedToken) {
      req.user = await User.findById(decodedToken.id)
    }
  }
  next()
}

module.exports = { unknownEndpoint, errorHandler, userExtractor }
