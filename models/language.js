//TODO: change field name defaultFlagUnicode to describe
//new content, which is a two char country code ISO 3166-1 alpha-2

/**
 * Module, model
 * exports Language
 */
const mongoose = require('mongoose')

/**
 * const languageSchema
 * @description Determines and validates schema for Language document.
 * language code: ISO 639-2 Code
*/
const languageSchema = mongoose.Schema({
  code: {
    type: String,
    required: [true, 'code is missing'],
    minlength: [3, 'code should contain 3 chars'],
    maxlength: [3, 'code should contain 3 chars']
  },
  nameInEnglish: {
    type: String,
    minlength: [3, 'the name of the language in English should contain 3-50 chars'],
    maxlength: [50, 'the name of the language in English should contain 3-50 chars'],
    required: [true, 'the name of the language in English is missing'],
  },
  nameLocal: {
    type: String,
    minlength: [3, 'local name of the language should contain 3-50 chars'],
    maxlength: [50, 'local name of the language should contain 3-50 chars'],
    required: [true, 'local name of the language is missing'],
  },
  defaultFlagCountrycode: {
    type: String,
    minlength: [2, 'code of the country should contain 2 chars'],
    maxlength: [2, 'code of the country should contain 2 chars'],
  }
})

/**
 * Function set
 * @description Transforms method toJSON to return user object returned from the database,
 * to be correct form to send to the browser.
 */
languageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Language', languageSchema)
