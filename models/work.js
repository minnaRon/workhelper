/**
 * Module, model
 * exports Work
 */
const mongoose = require('mongoose')

/**
 * const workSchema
 * @description Determines and validates schema for Work document.
*/
const workSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is missing'],
    maxlength: [30, 'work name should contain max 30 chars']
  },
  isProject: Boolean,
  type:
    {
      type: String,
      maxlength: [30, 'work type should contain max 30 chars']
    },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    reduired:[true, 'userId is missing']
  },
  active: {
    type: Boolean, default: true
  },
  lastWorked: Date
})

workSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Work', workSchema)
