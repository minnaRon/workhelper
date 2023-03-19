/**
 * Module, middleware
 * @description Handles requests and responses as wanted.
 * Exports as object functions unknownEndpoint, errorHandler
*/
const logger = require('./logger')

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

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}
module.exports = { unknownEndpoint, errorHandler }
