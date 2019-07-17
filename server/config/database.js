const mongoose = require('mongoose')
const keys = require('./keys')

mongoose.set('useFindAndModify', false)

module.exports = function() {
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
  mongoose.connection.on('error',() => {
      console.log("Error Connecting to Database.")
  })
  mongoose.connection.once('open', function(){
      console.log("Database succesfully connected.")
  })
  mongoose.connection.on('disconnected', () => {
      console.log("RIP Database.");
  })
}
