/**
 * functions and arrays to use in tests for help testing
 * exports:
 * const {array} initialUsers - list of user objects with username, name and password.
 * function usersInDb - fetches all users from the test database.
 * function addUserToDb - adds user to the test database.
 */
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    username: 'minna',
    name: 'minna',
    password: 'salainen',
  },
  {
    username: 'requestUser',
    name: 'requestName',
    password: 'requestPassword',
  }
]

const addUserToDb = async ({ username, name, password }) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, name, passwordHash })
  await user.save()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { initialUsers, usersInDb, addUserToDb }