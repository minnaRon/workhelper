const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]
const appName = 'testingMongoDbConnection'

const url = `mongodb+srv://minnaRon:${password}@cluster0.yvj28z8.mongodb.net/${appName}?retryWrites=true&w=majority`

mongoose.connect(url)

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
})

const User = mongoose.model('User', userSchema)

const user = new User({
  username: 'mongoJsUsername',
  name:'mongoJsName'
})

user.save().then(newUser => {
  console.log(`new mongoJsUser ${newUser.name} saved!`)
  mongoose.connection.close()
})
