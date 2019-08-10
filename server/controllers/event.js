
const Event = require('../models/event')
const User = require('../models/user')
const socketServer = require('../sockets/sockets')


module.exports = {
    async find(req, res) {
        const result = await Event.find(req.query).sort({created: 'desc'}).limit(50).populate('user')
        res.status(200).send(result)
    },
    async create(req, res) {
        const newEvent = new Event(req.body)
        const result = await newEvent.save()
        const io = socketServer.getServer()
        
        result.user = result.user ? await User.findById(result.user) : null
        io.emit('newEvent', result)
        return res.status(200).send(await newEvent.save())
    },
    async remove(req, res) {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).send({error: 'Event not found.'})
        }
        if (!event.user) {
            return res.status(400).send({'error':'Only message type events can be deleted.'})
        }
    
        await event.remove(req.params.id)
        return res.status(200).end()
    }
}
