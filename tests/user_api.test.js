/**
 * integration tests: creating a new user
 */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

describe('creating new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })
  test('adds valid user into db', async () => {
    const newUser = {
      username: 'testUsername',
      name: 'testName',
      password: 'testPassword',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length +1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('fails if username already taken', async () => {
    const newUser = {
      username: helper.initialUsers[1].username,
      name: 'testName',
      password: 'testPassword',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length)
    expect(result.body.error).toContain('username must be unique')
  })
  test('fails if username too short', async () => {
    const newUser = {
      username: '123',
      name: 'testName',
      password: 'testPassword',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    expect(result.body.error).toContain('username should contain 4-50 chars')
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain('123')
  })
  test('fails if name missing', async () => {
    const newUser = {
      username: 'testUsername',
      name: '',
      password: 'testPassword',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length)
    expect(result.body.error).toContain('name is missing')
  })
  test('fails if username missing', async () => {
    const newUser = {
      username: '',
      name: 'testName',
      password: 'testPassword',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length)
    expect(result.body.error).toContain('username is missing')
  })
  test('fails if password too short', async () => {
    const newUser = {
      username: 'testUsername',
      name: 'testName',
      password: '1234567',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length)
    expect(result.body.error).toContain('password should be 8-50 chars')
  })
  test('contains joiningday', async () => {
    const newUser = {
      username: 'testUsername',
      name: 'testName',
      password: 'testPassword',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length +1)
    expect(result.body.joiningday).toBeDefined()
  })
  test('not containing passwordHash', async () => {
    const newUser = {
      username: 'testUsername',
      name: 'testName',
      password: 'testPassword',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length +1)
    expect(result.body.passwordHash).not.toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
