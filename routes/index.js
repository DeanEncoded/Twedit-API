// routes
const auth = require('./auth')
const tweet = require('./tweet')
const tweets = require('./tweets')
const data = require('./data')

module.exports = app => {
  app.use('/auth', auth),
  app.use('/tweet',tweet),
  app.use('/tweets',tweets),
  app.use('/data',data)
}