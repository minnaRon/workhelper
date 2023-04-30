/**
 * integration tests: work
 */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')
const Work = require('../models/work')

describe('creating new work ', () => {
  test('if user not logged in fails to add work with valid properties into the database', async () => {
    await User.deleteMany({})
    await Work.deleteMany({})
    const newwork = helper.testworks[0]
    await api
      .post('/api/works')
      .send(newwork)
      .expect(401)
    const worksAtEnd = await helper.worksInDb()
    expect(worksAtEnd).toHaveLength(0)
  })
  describe('when user logged in and two users in the db ', () => {
    let token
    // eslint-disable-next-line no-unused-vars
    let user1
    let user2
    beforeEach(async () => {
      await User.deleteMany({})
      await Work.deleteMany({})
      user1 = await helper.addUserToDb({ username: 'testUsernameLogging', name: 'testNameLogging', password: 'salainen' })
      user2 = await helper.addUserToDb({ username: 'testUsernameLogging2', name: 'testNameLogging2', password: 'salainen2' })
      const response = await api
        .post('/api/login')
        .send({ username: 'testUsernameLogging2', password: 'salainen2' })

      token = response.body.token
    })
    test('adds work with valid properties into the database', async () => {
      const newwork = helper.testworks[0]
      await api
        .post('/api/works')
        .send(newwork)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const worksAtEnd = await helper.worksInDb()
      expect(worksAtEnd).toHaveLength(1)
      const savedWork = worksAtEnd[0]
      expect(savedWork.name).toBe(helper.testworks[0].name)
      expect(savedWork.isProject).toBe(helper.testworks[0].isProject)
      expect(savedWork.type).toBe(helper.testworks[0].type)
      expect(savedWork.active).toBe(helper.testworks[0].active)
      expect(savedWork.lastWorked).toBeDefined()
      expect(savedWork.user).toEqual(user2._id)
    })
    test('fails if user have work with this name already in the database', async () => {
      const newwork = helper.testworks[0]
      await helper.addWorkToDb(newwork, 'testUsernameLogging2')
      const result = await api
        .post('/api/works')
        .send(newwork)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(await helper.worksInDb()).toHaveLength(1)
      expect(result.body.error).toContain('user already has work with this name')
    })
    test('fails if work name missing', async () => {
      const newwork = {
        ...helper.testworks[0], name: ''
      }
      const result = await api
        .post('/api/works')
        .send(newwork)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(await helper.worksInDb()).toHaveLength(0)
      expect(result.body.error).toContain('name is missing')
    })
    test('fails if work name too long', async () => {
      const newwork = {
        ...helper.testworks[0], name: 'moreThanMaxO123456789O123456789O123456789'
      }
      const result = await api
        .post('/api/works')
        .send(newwork)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(await helper.worksInDb()).toHaveLength(0)
      expect(result.body.error).toContain('work name should contain max 30 chars')
    })
    test('fails if work type too long', async () => {
      const newwork = {
        ...helper.testworks[0], type: 'moreThanMaxO123456789O123456789O123456789'
      }
      const result = await api
        .post('/api/works')
        .send(newwork)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(await helper.worksInDb()).toHaveLength(0)
      expect(result.body.error).toContain('work type should contain max 30 chars')
    })
    describe('and three works already in the db ', () => {
      // eslint-disable-next-line no-unused-vars
      let work0own
      let work1others
      let work2own
      beforeEach(async () => {
        work0own = await helper.addWorkToDb(helper.testworks[0], 'testUsernameLogging2')
        work1others = await helper.addWorkToDb(helper.testworks[1], 'testUsernameLogging')
        work2own = await helper.addWorkToDb(helper.testworks[2], 'testUsernameLogging2')
      })
      test('fetches all users works from db', async () => {
        const result = await api
          .get('/api/works')
          .set('Authorization', `bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const worksFromDb = await helper.worksInDb()
        expect(worksFromDb).toHaveLength(3)
        expect(result.body).toHaveLength(worksFromDb.length -1)

        const resultNames = result.body.map(r => r.name)
        expect(resultNames).toContain(helper.testworks[0].name)
        expect(resultNames).toContain(helper.testworks[2].name)
        expect(resultNames).not.toContain(helper.testworks[1].name)
      })
      test('fetches individual work based on users own work id from db', async () => {
        const result = await api
          .get(`/api/works/${work2own._id}`)
          .set('Authorization', `bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const worksFromDb = await helper.worksInDb()
        expect(worksFromDb).toHaveLength(3)

        expect(result.body.name).toBe(helper.testworks[2].name)
      })
      test('fails to fetch individual work if work is not users own ', async () => {
        const result = await api
          .get(`/api/works/${work1others._id}`)
          .set('Authorization', `bearer ${token}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        const worksFromDb = await helper.worksInDb()
        expect(worksFromDb).toHaveLength(3)

        expect(result.body.name).not.toBeDefined()
        expect(result.body.error).toContain('only own created work is possible to fetch')
      })
      test('updates individual work based on users own work id from db', async () => {
        work2own.name ='newName'
        work2own.type = 'newType'
        work2own.isProject = false

        const result = await api
          .put(`/api/works/${work2own._id}`)
          .set('Authorization', `bearer ${token}`)
          .send(work2own)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const worksFromDb = await helper.worksInDb()
        expect(worksFromDb).toHaveLength(3)

        expect(result.body.name).toBe('newName')
        expect(result.body.type).toBe('newType')
        expect(result.body.isProject).toBe(false)
      })
      test('fails to update individual work if work is not users own ', async () => {
        work1others.name ='newName'
        work1others.type = 'newType'
        work1others.isProject = false

        const result = await api
          .put(`/api/works/${work1others._id}`)
          .set('Authorization', `bearer ${token}`)
          .send(work1others)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        const worksFromDb = await helper.worksInDb()
        expect(worksFromDb).toHaveLength(3)

        expect(result.body.name).not.toBeDefined()
        expect(result.body.error).toContain('only own created work is possible to update')
      })
      test('deletes individual work based on users own work id from db', async () => {
        const worksFromDbStart = await helper.worksInDb()

        await api
          .delete(`/api/works/${work2own._id}`)
          .set('Authorization', `bearer ${token}`)
          .expect(204)

        const worksFromDbEnd = await helper.worksInDb()
        expect(worksFromDbEnd).toHaveLength(worksFromDbStart.length -1)

        const worksFromDbEndNames = worksFromDbEnd.map(w => w.name)
        expect(worksFromDbEndNames).toContain(helper.testworks[0].name)
        expect(worksFromDbEndNames).toContain(helper.testworks[1].name)
        expect(worksFromDbEndNames).not.toContain(helper.testworks[2].name)
      })
      test('fails to delete individual work if work is not users own ', async () => {
        const worksFromDbStart = await helper.worksInDb()

        await api
          .put(`/api/works/${work1others._id}`)
          .set('Authorization', `bearer ${token}`)
          .send(work1others)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        const worksFromDbEnd = await helper.worksInDb()
        expect(worksFromDbEnd).toHaveLength(worksFromDbStart.length)

        const worksFromDbEndNames = worksFromDbEnd.map(w => w.name)
        expect(worksFromDbEndNames).toContain(helper.testworks[0].name)
        expect(worksFromDbEndNames).toContain(helper.testworks[1].name)
        expect(worksFromDbEndNames).toContain(helper.testworks[2].name)
      })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
