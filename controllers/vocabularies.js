/**
 * Module, router
 * @description Is used to manage vocabularies.
 * exports vocabulariesRouter
 */
const vocabulariesRouter = require('express').Router()
const Vocabulary = require('../models/vocabulary')

/**
 * vocabulariesRouter.get, listens path '/api/vocabularies/:id'
 * @returns vocabulary with requested language.id
 */
vocabulariesRouter.get('/:languageId', async (req, res) => {
  const languageId = req.params.languageId
  const vocabulary = await Vocabulary.find({ language: languageId })

  res.status(200).json(vocabulary[0])
})

/**
 * vocabulariesRouter.post, listens path '/api/vocabularies'
 * ..in progress.. now dev uses to create vocabulary using rest requests
 * @returns saved vocabulary or error code
 */
vocabulariesRouter.post('/', async (req, res) => {
  const body = req.body
  const languageCode = body.languageCode
  const existingVocabulary = await Vocabulary.findOne({ languageCode })

  if (existingVocabulary) {
    return res.status(400).json({ error:`vocabulary with languageCode '${existingVocabulary.languageCode}' already exists` })
  }

  const newVocabulary = new Vocabulary({
    language: body.language,
    languageCode: body.languageCode,
    vocabulary: body.vocabulary,
    lastUpdate: new Date()
  })
  const savedVocabulary = await newVocabulary.save()

  res.status(201).json(savedVocabulary.toJSON())
})

/**
 * vocabulariesRouter.put, listens path '/api/vocabularies/:id'
 * ..in progress.. is needed.. ?
 * @returns updated vocabulary
 */
vocabulariesRouter.put('/:id', async (req, res) => {
  const vocabulary = req.body
  vocabulary.lastUpdate = new Date()
  const updatedVocabulary = await Vocabulary.findByIdAndUpdate(req.params.id, vocabulary, { new:true, runValidators: true, context:'query' })

  res.status(200).json(updatedVocabulary.toJSON())
})

/**
 * vocabulariesRouter.delete, listens path '/api/vocabularies'
 * dev only - clears all vocabularies from the database
 */
vocabulariesRouter.delete('/', async (req, res) => {
  await Vocabulary.deleteMany({})
  res.status(204).end()
})

module.exports = vocabulariesRouter
