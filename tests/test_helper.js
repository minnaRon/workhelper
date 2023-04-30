/**
 * functions and arrays to use in tests for help testing
 * exports:
 * const {array} initialUsers - list of user objects with username, name and password.
 * const {array} testWorks - list of work objects with name:string, type:string, isProject:boolean and active:boolean.
 * const {array} testLanguages - List of languages
 * * with properties:
 * * * code - 3 chars languageCode, nameInEnglish, nameLocal - native language name,
 * * * defaultFlagCountryCode - 2 chars country code
 * const {array} testVocabularies, with properties:
 * * * language, languageCode,
 * * * vocabulary: { checked: { componentName: { placeName of text: translation}}}
 * function usersInDb - fetches all users from the test database.
 * function worksInDb - fetches all works from the test database.
 * function addUserToDb - adds user to the test database.
 * function addWorkToDb - adds work to the test database and adds workId to users document.
 * function languagesInDb - fetches all languages from the test database.
 * function vocabulariesInDb - fetches all vocabularies from the test database.
 */
const User = require('../models/user')
const bcrypt = require('bcrypt')
const Work = require('../models/work')
const Language = require('../models/language')
const Vocabulary = require('../models/vocabulary')

const initialUsers = [
  {
    username: 'minna',
    name: 'minna',
    password: 'salainen',
  },
  {
    username: 'requestUser',
    name: 'requestName',
    password: 'requestPassword',
  }
]

const testworks = [
  {
    name: 'testWork',
    isProject: true,
    type: 'working at home',
    active: true,
  },
  {
    name: 'testWork2',
    isProject: false,
    type: 'studying',
    active: true,
  },
  {
    name: 'testWork3',
    isProject: true,
    type: 'excursion',
    active: true,
  },
]

const testLanguages = [
  {
    code: 'eng',
    nameInEnglish: 'English',
    nameLocal: 'English',
    defaultFlagCountrycode: 'GB',
  },
  {
    code: 'fin',
    nameInEnglish: 'Finnish',
    nameLocal: 'suomi',
    defaultFlagCountrycode: 'FI',
  },
]

const testVocabularies = [
  {
    language: '61d634706a98a61edd42bf45',
    languageCode: 'eng',
    vocabulary: {
      checked: {
        notificationMessages: {
          langRedErroraddNewLanguage: 'failed to add new language: ',
          userRedIloginUserstart: 'Welcome',
        },
        welcome: {
          WH2headlineT: 'WELCOME!',
          WBloginT: 'LOG IN',
          WLnewUserT: 'NEW USER',
        },
        loginform: {
          LFH2headlineT: 'LOG IN',
          LFIusernameT: 'username',
          LFIpasswordT: 'password',
          LFBsubmitT: 'LOGIN',
          LFBbackT: 'BACK',
          LFIforDevT: 'DEV HELPER INPUT',
          LFBforDevT: 'DEV HELPER BUTTON',
        },
        logininfo: {
          LIBlogoutT: 'LOG OUT',
        },
      },
    },
  },
  {
    language: '61d634706a98a61edd42bf55',
    languageCode: 'fin',
    vocabulary: {
      checked: {
        notificationMessages: {
          langRedErroraddNewLanguage: 'uuden kielen lisääminen epäonnistui: ',
          userRedIloginUserstart: 'Tervetuloa',
        },
        welcome: {
          WH2headlineT: 'TERVETULOA!',
          WBloginT: 'KIRJAUDU',
          WLnewUserT: 'UUSI KÄYTTÄJÄ',
        },
        loginform: {
          LFH2headlineT: 'KIRJAUTUMINEN',
          LFIusernameT: 'käyttäjänimi',
          LFIpasswordT: 'salasana',
          LFBsubmitT: 'KIRJAUDU',
          LFBbackT: 'TAKAISIN',
        },
        logininfo: {
          LIBlogoutT: 'KIRJAUDU ULOS',
        },
      },
    },
  },
]

const addUserToDb = async ({ username, name, password }) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, name, passwordHash })
  const savedUser = await user.save()
  return savedUser
}

const addWorkToDb = async (newWork, username) => {
  const users = await User.find({ username })
  const user = users[0]
  const work = new Work({
    ...newWork,
    lastWorked: new Date(),
    user: user._id
  })
  const savedwork = await work.save()
  user.works = [...user.works, savedwork._id]

  await user.save()
  return savedwork
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const worksInDb = async () => {
  const works = await Work.find({})
  return works.map(w => w.toJSON())
}

const languagesInDb = async () => {
  const languages = await Language.find({})
  return languages.map(l => l.toJSON())
}

const vocabulariesInDb = async () => {
  const vocabularies = await Vocabulary.find({})
  return vocabularies.map(l => l.toJSON())
}

module.exports = { initialUsers,  testLanguages,
  testVocabularies,testworks,
  usersInDb, worksInDb, addUserToDb, addWorkToDb, languagesInDb,
  vocabulariesInDb }