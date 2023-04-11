/**
 * integration tests: vocabulary
 */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')
const Vocabulary = require('../models/vocabulary')

describe('creating new vocabulary', () => {
  beforeEach(async () => {
    await Vocabulary.deleteMany({})
  })
  test('adds vocabulary with valid properties into the database', async () => {
    const newVocabulary = helper.testVocabularies[0]
    await api
      .post('/api/vocabularies')
      .send(newVocabulary)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const vocabulariesAtEnd = await helper.vocabulariesInDb()
    expect(vocabulariesAtEnd).toHaveLength(1)
    const code = vocabulariesAtEnd[0].languageCode
    expect(code).toBe(helper.testVocabularies[0].languageCode)
  })
  test('fails if vocabulary already in the database', async () => {
    await Vocabulary.insertMany(helper.testVocabularies)
    const newVocabulary = helper.testVocabularies[0]
    const result = await api
      .post('/api/vocabularies')
      .send(newVocabulary)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.vocabulariesInDb()).toHaveLength(helper.testVocabularies.length)
    expect(result.body.error).toContain('already exists')
  })
  test('fails if languageId is missing', async () => {
    const newVocabulary = {
      ...helper.testVocabularies[0], language: null
    }
    const result = await api
      .post('/api/vocabularies')
      .send(newVocabulary)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.vocabulariesInDb()).toHaveLength(0)
    expect(result.body.error).toContain('languageId is missing')
  })
  test('fails if language code too short', async () => {
    const newVocabulary = {
      ...helper.testVocabularies[0], languageCode: '12'
    }
    const result = await api
      .post('/api/vocabularies')
      .send(newVocabulary)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.vocabulariesInDb()).toHaveLength(0)
    expect(result.body.error).toContain('should contain 3 chars')
  })
  test('fails if language code too long', async () => {
    const newVocabulary = {
      ...helper.testVocabularies[0], languageCode: '1234'
    }
    const result = await api
      .post('/api/vocabularies')
      .send(newVocabulary)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(await helper.vocabulariesInDb()).toHaveLength(0)
    expect(result.body.error).toContain('should contain 3 chars')
  })
  test('fetches correct vocabulary from db', async () => {
    await Vocabulary.insertMany(helper.testVocabularies)
    const languageIdOfVocabulary = helper.testVocabularies[1].language
    const result = await api
      .get(`/api/vocabularies/${languageIdOfVocabulary}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(result.body.language.toString()).toBe(languageIdOfVocabulary.toString())
    expect(result.body.languageCode).toBe(helper.testVocabularies[1].languageCode)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
