/**
 * Module, router
 * exports testingRouter
 */
const testingRouter = require('express').Router()
const User = require('../models/user')
const Language = require('../models/language')
const Vocabulary = require('../models/vocabulary')

/**
 * testingRouter, listens path '/api/testing/reset'
 * @description Clears the testing database, adds languages and vocabularies in the database.
 * @returns status 200
 */
testingRouter.post('/reset', async (req, res) => {
  const { languages, vocabularies } = req.body
  //console.log('--testing--testinrouter--languagesWithoutId--', languages)
  await User.deleteMany({})
  await Language.deleteMany({})
  await Vocabulary.deleteMany({})
  const savedLanguages = await Language.insertMany(languages)
  // eslint-disable-next-line no-unused-vars
  const [ language1, language2, ...rest ] = savedLanguages
  const vocabulariesToSave = vocabularies.map(v => v.languageCode === language1.code ? { ...v, language: language1._id } : { ...v, language: language2._id })

  //console.log('--testing--testinrouter--vocabulariesToSave--', vocabulariesToSave)
  await Vocabulary.insertMany(vocabulariesToSave)
  res.status(200).end()
})

module.exports = testingRouter
