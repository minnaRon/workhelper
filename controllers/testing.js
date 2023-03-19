/**
 * Module, router
 * exports testingRouter
 */
const testingRouter = require('express').Router()
const User = require('../models/user')

/**
 * testingRouter, listens path '/reset'
 * @description Clears testing database.
 * @returns status 204
 */
testingRouter.post('/reset', async (req, res) => {
  await User.deleteMany({})
  res.status(204).end()
})

module.exports = testingRouter
