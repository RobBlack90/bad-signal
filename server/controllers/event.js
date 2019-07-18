
let Event = require('../models/event')

exports.find = async (req, res) => {
  let result = await Event.find(req.query).sort({created: 'desc'}).limit(50).populate('user')
  res.status(200).send(result)
}

exports.create = async(req, res) => {
    const newEvent = new Event(req.body)
    let result = await newEvent.save()
    res.status(200).send(result)
}

exports.remove = async(req, res) => {
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
}