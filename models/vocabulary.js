/**
 * Module, model
 * exports Vocabulary
 */
const mongoose = require('mongoose')

/**
 * const vocabularySchema
 * @description Determines and validates schema for Vocabulary document.
 * language code: ISO 639-2 Code
*/
const vocabularySchema = mongoose.Schema({
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: [true, 'languageId is missing']
  },
  languageCode: {
    type: String,
    required: [true, 'languageCode is missing'],
    minlength: [3, 'languageCode should contain 3 chars'],
    maxlength: [3, 'languageCode should contain 3 chars']
  },
  vocabulary: {
    checked: {},
    newPlaces:{}
  },
  lastUpdate: Date
})

/**
 * Function set
 * @description Transforms method toJSON to return vocabulary object returned from the database,
 * to be correct form to send to the browser.
 */
vocabularySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Vocabulary', vocabularySchema)
