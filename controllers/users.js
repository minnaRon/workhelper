/**
 * Module, router
 * exports usersRouter
 */
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

/**
 * usersRouter, listens path '/'
 * @description Adds a valid new user to the database.
 * request @param {string} username - user's input for username
 * request @param {string} name - user's input for name
 * request @param {string} password - user's input for password
 * Checks if user's username is unique
 * if not:
 * * @returns error message with status 400
 * Checks if password is valid
 * if not:
 * * @returns error message with status 400
 * then if given params are still valid to create new user:
 * * salts and crypts password,
 * * creates new user object with
 * * properties: username, name, passwordHash, joiningday, lastVisited,
 * * saves user to database and
 * * @returns saved user with status 201
 */
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error:'username must be unique' })
  }
  if (password.length < 8 || password.length > 50){
    return res.status(400).json({ error: 'password should be 8-50 chars' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
    joiningday: new Date(),
    lastVisited: new Date()
  })
  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter
