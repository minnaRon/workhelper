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
    workTypes: ['working at home', 'studying'],
    joiningday: new Date(),
    lastVisited: new Date()
  })
  //console.log('--users--newuser--', user)

  const savedUser = await user.save()
  //console.log('--users--savedUser--', savedUser)
  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  //TEE token vain userin omat
  // const works = await Work.find({ user: user._id.toString() }) //.populate('user', {username:1, name:1})
  const users = await User.find({}) //.populate('user', {username:1, name:1})
  console.log('--back--works--users fromdb--', users)
  res.json(users)
})


usersRouter.get('/:id', async (req, res) => {
  console.log('--users--get--:id--req.params.id--',req.params.id)
  // const userId = req.params.id
  const user = await User.findById(req.params.id)
  console.log('--users--get--user--',user)
  res.status(200).json(user)
})

usersRouter.put('/:id', async (req, res) => {
  //const { username, name, passwordHash, joiningday, lastVisited } = req.body
  //TEE lisää tarkastus vanha hash oikea username
  //TEE voi muuttaa vain name, passwordHash, lastVisited
  // const updatedUser = { username, name, passwordHash, joiningday, lastVisited }
  const updatedUser = req.body
  console.log('--users--put--updatedUser--',updatedUser);
  const savedUser = await User.findByIdAndUpdate(
    req.params.id,
    updatedUser,
    { new: true, runValidators: true, context: 'query' }
  )
  console.log('--users--put--savedUser--',savedUser);

  res.json(savedUser)
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
