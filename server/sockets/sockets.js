const socket = require('socket.io')
const Event = require('../models/event')
const User = require('../models/user')

let io 

function init(server) {
    io = socket(server)

    io.on("connection", function(socket) {
        console.log(`Connection with socket ${socket.id}`)

        socket.on("disconnect", async function() {
            console.log(`Disconnected from socket ${socket.id}`)
        })
        
        socket.on('userUpdated', async (user) => {
            const exisitingUser = await User.findById(user._id)
            if (user.isOnline !== exisitingUser.isOnline) {
                const inOut = user.isOnline === true ? 'entered' : 'left'
                const leftEvent = await new Event({ message : `${user.name} has ${inOut} the chat.`}).save()
                console.log(leftEvent.message)
                io.emit('newEvent', leftEvent)
            }
            await User.findByIdAndUpdate(user._id, user, { new: true })
            io.emit('userChange', user)
        })
    })
}

function getServer() {
    return io
}

module.exports = {
    init,
    getServer
}