/**
 * integration tests: language
 */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')
const Language = require('../models/language')

describe('creating new language', () => {
  beforeEach(async () => {
    await Language.deleteMany({})
  })
  test('adds language with valid properties into the database', async () => {
    const newlanguage = helper.testLanguages[0]
    await api
      .post('/api/languages')
      .send(newlanguage)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const languagesAtEnd = await helper.languagesInDb()
    expect(languagesAtEnd).toHaveLength(1)
    const code = languagesAtEnd[0].code
    expect(code).toBe(helper.testLanguages[0].code)
  })
  test('fails if language already in the database', async () => {
    await Language.insertMany(helper.testLanguages)
    const newlanguage = helper.testLanguages[0]

    const result = await api
      .post('/api/languages')
      .send(newlanguage)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.languagesInDb()).toHaveLength(helper.testLanguages.length)
    expect(result.body.error).toContain('already exists')
  })
  test('fails if language code missing', async () => {
    const newlanguage = {
      ...helper.testLanguages[0], code: ''
    }
    const result = await api
      .post('/api/languages')
      .send(newlanguage)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.languagesInDb()).toHaveLength(0)
    expect(result.body.error).toContain('code is missing')
  })
  test('fails if language code too short', async () => {
    const newlanguage = {
      ...helper.testLanguages[0], code: '12'
    }
    const result = await api
      .post('/api/languages')
      .send(newlanguage)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.languagesInDb()).toHaveLength(0)
    expect(result.body.error).toContain('code should contain 3 chars')
  })
  test('fails if country code too long', async () => {
    const newlanguage = {
      ...helper.testLanguages[0], defaultFlagCountrycode: '123'
    }
    const result = await api
      .post('/api/languages')
      .send(newlanguage)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.languagesInDb()).toHaveLength(0)
    expect(result.body.error).toContain('code of the country should contain 2 chars')
  })
  test('fetches all languages from db', async () => {
    await Language.insertMany(helper.testLanguages)
    const result = await api
      .get('/api/languages')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const languagesFromDb = await helper.languagesInDb()
    expect(languagesFromDb).toHaveLength(helper.testLanguages.length)
    expect(result.body).toHaveLength(languagesFromDb.length)
    const resultCodes = result.body.map(r => r.code)
    expect(resultCodes).toContain(helper.testLanguages[0].code)
    expect(resultCodes).toContain(helper.testLanguages[1].code)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
