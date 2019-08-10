const User = require('../models/user')
const Event = require('../models/event')
const socketServer = require('../sockets/sockets')


module.exports = {
  async find(req, res) {
    let result = await User.find(req.query)
    return res.status(200).send(result)
  },
  async findById(req, res) {
    const user = await User.findById(req.params.id)
    return user ? res.send(user) : res.status(404).send({error: 'User not found.'})
  },
  async create(req, res) {
    const newUser = new User(req.body)
    return res.status(200).send(await newUser.save())
  },
  async update(req, res) {
    const io = socketServer.getServer()
    const exisitingUser = await User.findById(req.params.id)
    const user = req.body
    if (user.isOnline !== exisitingUser.isOnline) {
        const inOut = user.isOnline === true ? 'entered' : 'left'
        const event = await new Event({ message : `${user.name} has ${inOut} the chat.`}).save()
        console.log(event.message)
        io.emit('newEvent', event)
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true })
    io.emit('userChange', user)
    return updatedUser ? res.send(updatedUser) : res.status(404).send({error: 'User not found.'})
  },
  async remove(req, res) {
    const user = await User.findByIdAndRemove(req.params.id)
    return user ? res.status(200).end() : res.status(404).send({error: 'User not found.'})
  }
}
