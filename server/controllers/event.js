
let Event = require('../models/event')

module.exports = {
    async find(req, res) {
        let result = await Event.find(req.query).sort({created: 'desc'}).limit(50).populate('user')
        res.status(200).send(result)
    },
    async create(req, res) {
        const newEvent = new Event(req.body)
        res.status(200).send(await newEvent.save())
    },
    async remove(req, res) {
        let event = await Event.findById(req.params.id)
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
