/**
 * Module, router
 * @description Is used to manage Works.
 * exports WorksRouter
*/
const worksRouter = require('express').Router()
const Work = require('../models/work')

/**
 * worksRouter.get, listens path '/api/works'
 * @returns all works of the user from the database
 */
worksRouter.get('/', async (req, res) => {
  const works = await Work.find({ user: req.user._id })
  res.json(works)
})

/**
 * worksRouter.get, listens path '/api/works/:id'
 * ..in progress.. is needed later
 * @returns the work of the user according to the id from the database
*/
worksRouter.get('/:id', async (req, res) => {
  const work = await Work.findById(req.params.id)
  if (work && work.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: 'only own created work is possible to fetch' })
  } else if (work && work.user.toString() === req.user._id.toString()) {
    return res.json(work)
  }
})

/**
 * worksRouter.post, listens path '/api/works'
 * @description adds work object to the database and adds the work object id to user's document
 * @returns saved work
 */
worksRouter.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const existingWork = await Work.find({ user: req.user._id, name: req.body.name })
  if (existingWork[0]) {
    return res.status(400).json({ error: 'user already has work with this name' })
  }
  const user = req.user
  const work = new Work({
    ...req.body,
    lastWorked: new Date(),
    user: user._id
  })
  const savedwork = await work.save()

  user.works = [...user.works, savedwork._id]
  await user.save()

  res.status(201).json(savedwork)
})

/**
 * worksRouter.put, listens path '/api/works/:id'
 * @description updates user's work object
 * @returns updated and saved work
 */
//check validation errors to use middleware only
worksRouter.put('/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const workToUpdate = await Work.findById(req.params.id)
  if (!workToUpdate) {
    return res.status(400).json({ error: 'malformatted id' })
  }
  if (workToUpdate.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: 'only own created work is possible to update' })
  }

  const updatedWork = {
    ...req.body,
    lastWorked: new Date()
  }

  const savedwork = await Work.findByIdAndUpdate(req.params.id, updatedWork, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  res.json(savedwork.toJSON())
})

/**
 * worksRouter.delete, listens path '/api/works/:id'
* ..in progress..is needed later..
 * @description deletes user's own work object from works collection and deletes work object id from user's document
 * @returns status 204 as not found
 */
worksRouter.delete('/:id', async (req,res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const workToDelete = await Work.findById(req.params.id)
  if (!workToDelete) {
    return res.status(204).end()
  }
  if (workToDelete.user && workToDelete.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: 'only own created work can be deleted' })
  }
  await Work.findByIdAndRemove(req.params.id)

  const user = req.user
  user.works = user.works.filter(wId =>  wId.toString() !== req.params.id.toString())

  await user.save()

  res.status(204).end()
})

/**
 * worksRouter.delete, listens path '/api/works'
 * dev only - clears all works from the database
 */
worksRouter.delete('/', async (req, res) => {
  await Work.deleteMany({})
  res.status(204).end()
})

module.exports = worksRouter
