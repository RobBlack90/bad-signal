let User = require('../models/user')


module.exports = {
  async find(req, res) {
    let result = await User.find(req.query)
    res.status(200).send(result)
  },
  async findById(req, res) {
    const user = await User.findById(req.params.id)
    return user ? res.send(user) : res.status(404).send({error: 'User not found.'})
  },
  async create(req, res) {
    const newUser = new User(req.body)
    res.status(200).send(await newUser.save())
  },
  async update(req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    return user ? res.send(user) : res.status(404).send({error: 'User not found.'})
  },
  async remove(req, res) {
    const user = await User.findByIdAndRemove(req.params.id)
    return user ? res.status(200).end() : res.status(404).send({error: 'User not found.'})
  }
}
