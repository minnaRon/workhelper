/**
 * Module, router
 * @description Is used to manage languages.
 * exports languagesRouter
 */
const languagesRouter = require('express').Router()
const Language = require('../models/language')

/**
 * languagesRouter.get, listens path '/api/languages'
 * @returns all languages
 */
languagesRouter.get('/', async (req, res) => {
  const languages = await Language.find({})
  res.status(200).json(languages)
})

/**
 * languagesRouter.get, listens path '/api/languages/:id'
 * @returns language with requested language.id
 * (check if still needed in the app?)
 */
languagesRouter.get('/:id', async (req, res) => {
  const language = await Language.find({ id: req.params.id })
  res.status(200).json(language.toJSON())
})

/**
 * languagesRouter.post, listens path '/api/languages'
 * ..in progress.. now dev uses to create language using rest requests
 * @returns saved language or error code
 */
languagesRouter.post('/', async (req, res) => {
  const body = req.body
  const code = req.body.code
  const existingLanguage = await Language.findOne({ code })
  if (existingLanguage) {
    return res.status(400).json({ error:`language with code '${code}' already exists` })
  }
  const newLanguage = new Language({
    ...body
  })
  const savedLanguage = await newLanguage.save()
  res.status(201).json(savedLanguage.toJSON())
})

/**
 * languagesRouter.put, listens path '/api/languages/:id'
 * ..in progress.. is needed.. ?
 * @returns updated language
 */
languagesRouter.put('/:id', async (req, res) => {
  const language = req.body
  const updatedLanguage = await Language.findByIdAndUpdate(req.params.id, language, { new:true, runValidators: true, context:'query' })
  res.status(200).json(updatedLanguage.toJSON())
})

/**
 * languagesRouter.delete, listens path '/api/languages'
 * dev only - clears all languages from the database
 */
languagesRouter.delete('/', async (req, res) => {
  await Language.deleteMany({})
  res.status(204).end()
})

module.exports = languagesRouter
