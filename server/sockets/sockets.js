
const socket = require('socket.io')
const Event = require('../models/event')
const User = require('../models/user')

module.exports = function (server) {
  let io =  socket(server)

  io.on("connection", function(socket) {
      console.log(`Connection with socket ${socket.id}`)
  
      socket.on("disconnect", async function() {
          console.log(`Disconnected from socket ${socket.id}`)
      })
  
      socket.on('userJoined', async (user) => {
          user.isOnline = true
          await User.updateOne({_id: user._id}, {$set: {isOnline:true}})
  
          const joinedEvent = await new Event({ message : `${user.name} has entered the chat.`, type: 'event'}).save()
          console.log(joinedEvent.message)
          io.emit('newEvent', joinedEvent)
  
          const users = await User.find({isOnline:true})
          io.emit('currentUsers', users)
      })
  
      socket.on('userLeft', async (user) => {
          user.isOnline = false
          await User.updateOne({_id: user._id}, {$set: {isOnline:false}})
  
          const leftEvent = await new Event({ message : `${user.name} has left the chat.`, type: 'event'}).save()
          console.log(leftEvent.message)
          io.emit('newEvent', leftEvent)
  
          const users = await User.find({isOnline:true})
          io.emit('currentUsers', users)
      })
  
      socket.on('eventSent', async (event) => {
          const newEvent = new Event(event)
          let result = await newEvent.save()
          result.user = result.user ? await User.findById(result.user) : null
          io.emit('newEvent', result)
      })
  })
}