/**
 * Module, configuration
 * @description Configurates used port and database depending chosen mode.
 * Exports as object constants PORT, MONGODB_URI
 */
require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = { PORT, MONGODB_URI }
