const express  = require('express')
const bodyParser = require('body-parser')
const db = require('./config/database')
const cors = require('cors')
const userRoutes = require('./routes/user')
const eventRoutes = require('./routes/event')
const sockets = require('./sockets/sockets')

const app = new express()
app.use(bodyParser.json())
app.use(cors())

db()

app.use('/users', userRoutes)
app.use('/events', eventRoutes)

const server = app.listen(5000,() => {
  console.log("Connection on PORT 5000")   
})

sockets(server)