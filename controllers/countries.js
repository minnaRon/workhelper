/**
 * Module, router
 * @description Is used to manage countries.
 * exports countriesRouter
 */
const countriesRouter = require('express').Router()
const Country = require('../models/country')

/**
 * countriesRouter.get, listens path '/api/countries/:id'
 * ..in progress.. use with the selected country of the NewUserForm to determine language for user
 */
countriesRouter.get('/:id', async (req, res) => {
  //console.log('--countries--get--:country--req.params.id--',req.params.id)
  const country = await Country.find({ id: req.params.id })
  //console.log('--countries--get--country--',country)
  res.status(200).json(country.toJSON())
})

/**
 * countriesRouter.post, listens path '/api/countries/'
 * ..in progress.. now is used with dev rest request
 */
countriesRouter.post('/', async (req, res) => {
  const body = req.body
  //console.log('--countries--post--req.body--',req.body)
  const newCountry = new Country({
    ...body
  })
  //console.log('--countries--newcountry--',newCountry)
  const savedCountry = await newCountry.save()
  //console.log('--countries--savedCountry--',savedCountry)
  res.status(201).json(savedCountry.toJSON())
})

/**
 * countriesRouter.put, listens path '/api/countries/:id'
 * ..in progress..
 */
countriesRouter.put('/:id', async (req, res) => {
  const country = req.body
  const updatedCountry = await Country.findByIdAndUpdate(req.params.id, country, { new:true, runValidators: true, context:'query' })
  res.status(200).json(updatedCountry.toJSON())
})

/**
 * countriesRouter.delete, listens path '/api/countries'
 * dev only - clears all countries from the database
 */
countriesRouter.delete('/', async (req, res) => {
  await Country.deleteMany({})
  res.status(204).end()
})

module.exports = countriesRouter
