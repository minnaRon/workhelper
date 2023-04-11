/**
 * Module, router
 * exports usersRouter
 */
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

/**
 * usersRouter, listens path '/api/users'
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
  const { username, name, password, languageId } = req.body
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
    language: languageId,
    joiningday: new Date(),
    lastVisited: new Date()
  })
  //console.log('--users--newuser--', user)

  const savedUser = await user.save()
  //console.log('--users--savedUser--', savedUser)
  res.status(201).json(savedUser)
})

/**
 * usersRouter.delete, listens path '/api/users'
 * dev only - clears all users from the database
 */
usersRouter.delete('/', async (req, res) => {
  await User.deleteMany({})
  res.status(204).end()
})

module.exports = usersRouter
