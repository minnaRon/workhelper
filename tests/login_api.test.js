/**
 * integration tests: login
 */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

describe('user logging in', () => {
  beforeEach(async () => {
    jest.setTimeout(10000)
    await User.deleteMany({})
    await helper.addUserToDb({ username: 'testUsernameLogging', name: 'testNameLogging', password: 'salainen' })
    await helper.addUserToDb({ username: 'testUsernameLogging2', name: 'testNameLogging2', password: 'salainen2' })
    jest.setTimeout(5000)
  })
  test('succeeds with correct credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testUsernameLogging2', password: 'salainen2' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.token).toBeDefined()
    expect(response.body.username).toBe('testUsernameLogging2')
    expect(response.body.name).toBe('testNameLogging2')
  })
  test('fails with incorrect password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testUsernameLogging', password: 'salainen2' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('invalid username or password')
  })
  test('fails with incorrect username', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'wrongTestUsernameLogging', password: 'salainen' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('invalid username or password')
  })
  test('changes new and correct lastVisited day', async () => {
    const userLogging = { username: 'testUsernameLogging', password: 'salainen' }
    const usersInDbStart = await helper.usersInDb()
    const userInDbStart = await usersInDbStart.filter(u => u.username === 'testUsernameLogging')[0]
    await api
      .post('/api/login')
      .send(userLogging)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const usersInDbEnd = await helper.usersInDb()
    const userInDbEnd = await usersInDbEnd.filter(u => u.username === 'testUsernameLogging')[0]
    expect(userInDbStart.lastVisited).not.toBe(userInDbEnd.lastVisited)
    expect(userInDbEnd.lastVisited.toISOString().split('T')[0]).toBe(new Date().toISOString().split('T')[0])
  })
})

afterAll(() => {
  mongoose.connection.close()
})
