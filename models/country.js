/**
 * Module, model
 * exports Country
 */
const mongoose = require('mongoose')

/**
 * const CountrySchema
 * @description Determines and validates schema for Country document.
 * country code: ISO 3166-1 alpha-2 Code
*/
const CountrySchema = mongoose.Schema({
  alpha2Code: {
    type: String,
    required: [true, 'country code is missing'],
    minlength: [2, 'country code should contain 2 chars'],
    maxlength: [2, 'country code should contain 2 chars']
  },
  nameEng: {
    type: String,
    required: [true, 'country name in Enlish is missing'],
  },
  nameNative: {
    type: String,
    required: [true, 'original country name is missing'],
  },
  languages: [{
    type: String,
    required: [true, 'language code is missing'],
    minlength: [3, 'language code should contain 3 chars'],
    maxlength: [3, 'language code should contain 3 chars']
  }],
  /*
  languages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language'
  }],
  */
  currency: String,
  utc_offset: [{
    type:String
  }],
  latlng:[]
})

/**
 * Function set
 * @description Transforms method toJSON to return Country object returned from the database,
 * to be correct form to send to the browser.
 */
CountrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Country', CountrySchema)
