/**
 * Module, router
 * exports loginRouter
 */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

/**
 * loginRouter, listens path '/api/login'
 * @description Checks user's credentials and authenticates
 * request @param {string} username - user's input for username
 * request @param {string} password - user's input for password
 * if credentials are not valid:
 * * @returns error message with status 401
 * if credentials are valid:
 * * updates user's lastVisited date to database,
 * * prepares token for user authentication,
 * * @returns user's token, username and name
 */
loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  user.lastVisited = new Date()
  await User.findByIdAndUpdate(
    user._id, user,
    { new: true, runValidators: true, context: 'query' }
  )

  const userForToken = {
    username: user.username,
    name: user.name,
    id: user._id
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 7 * 24 * 60 * 60 }
  )

  res.status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
