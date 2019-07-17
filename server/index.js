const express  = require('express')
const bodyParser = require('body-parser')
const db = require('./config/database');
// const mongoose = require('mongoose')
const socket = require('socket.io')
const cors = require('cors')
// const keys = require('./config/keys')
const Event = require('./model/event')
const User = require('./model/user')

const app = new express()
app.use(bodyParser.json())
app.use(cors())

db()

const server = app.listen(5000,() => {
  console.log("Connection on PORT 5000")   
})

// Setting up Socket.io
let io =  socket(server);

io.on("connection", function(socket) {
    console.log(`Connection with socket ${socket.id}`)

    socket.on("disconnect", async function() {
        console.log(`Disconnected from socket ${socket.id}`)
    })

    socket.on('userJoined', async (user) => {
        user.isOnline = true
        await User.updateOne({_id: user._id}, {$set: {isOnline:true}})

        const joinedEvent = await createAdminEvent(`New chat room member: ${user.name}`)
        console.log(joinedEvent.message)
        io.emit('newEvent', joinedEvent)

        const users = await User.find({isOnline:true})
        io.emit('currentUsers', users)
    })

    socket.on('userLeft', async (user) => {
        user.isOnline = false
        await User.updateOne({_id: user._id}, {$set: {isOnline:false}})

        const leftEvent = await createAdminEvent(`Another one bites the dust: ${user.name}`)
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



async function createAdminEvent(message) {
    const newEvent = new Event({ message, type: 'event'})
    return await newEvent.save()
}






app.get('/events', async (req, res) => {
  let result = await Event.find(req.query).sort({created: 'desc'}).limit(50).populate('user')
  res.status(200).send(result)
})

app.post('/events', async(req, res) => {
    const newEvent = new Event(req.body)
    let result = await newEvent.save()
    res.status(200).send(result)
})
app.delete('/events/:id', async(req, res) => {
    let event = await Event.findById(req.params.id)
    if (event.type !== 'message') {
        return res.status(400).send({'error':'Only message type events can be deleted.'})
    }

    event.remove(req.params.id,
        (err, event) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: `Event ${event._id} successfully deleted`,
            id: event._id
        };
        return res.status(200).send(response)
    });
})

app.post('/users', async(req, res) => {
    const newUser = new User(req.body)
    let result = await newUser.save()
    res.status(200).send(result)
})

app.get('/users', async (req, res) => {
    let result = await User.find(req.query)
    res.status(200).send(result)
  })

app.get('/users/:id', async(req, res) => {
    User.findById(req.params.id,
    (err, result) => {
        if (err) return res.status(500).send({'error': err})
        if (result === undefined) {
            res.status(400).send({'error':'User not found.'})
        } else {
            res.status(200).send(result)
        }
    })
})
app.put('/users/:id', async(req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true},
        (err, user) => {
            if (err) return res.status(500).send(err)
            return res.send(user)
        }
    )
})
app.delete('/users/:id', async(req, res) => {
    User.findByIdAndRemove(req.params.id,
        (err, user) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: `User ${user.name} successfully deleted`,
            id: user._id
        };
        return res.status(200).send(response)
    });
})