/**
 * Module, model
 * exports User
 */
const mongoose = require('mongoose')

/**
 * const userSchema
 * @description Determines and validates schema for User document.
 */
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is missing'],
    minlength: [4, 'username should contain 4-50 chars'],
    maxlength: [50, 'username should contain 4-50 chars']
  },
  name: {
    type: String,
    minlength: [3, 'name should contain 3-50 chars'],
    maxlength: [50, 'name should contain 3-50 chars'],
    required: [true, 'name is missing'],
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language'
  },
  passwordHash: String,
  works: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Work'
    }
  ],
  workTypes: [
    {
      type: String
    }
  ],
  joiningday: Date,
  lastVisited: Date
})

/**
 * Function set
 * @description Transforms method toJSON to return user object returned from the database,
 * to be correct form to send to the browser.
 */
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
