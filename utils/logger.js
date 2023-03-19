/**
 * Module, logger
 * @description Logs given params to the console as info or error
 * if mode is production or development.
 * Exports as object functions info, error
*/
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = { info, error }
