
let User = require('../models/user')

exports.find = async (req, res) => {
  let result = await User.find(req.query)
  res.status(200).send(result)
}

exports.findById = async (req, res) => {
  User.findById(req.params.id,
  (err, result) => {
      if (err) return res.status(500).send({'error': err})
      if (result === undefined) {
          res.status(400).send({'error':'User not found.'})
      } else {
          res.status(200).send(result)
      }
  })
}

exports.update = async (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true},
      (err, user) => {
          if (err) return res.status(500).send(err)
          return res.send(user)
      }
  )
}

exports.create = async (req, res) => {
  const newUser = new User(req.body)
  let result = await newUser.save()
  res.status(200).send(result)
}

exports.remove = async (req, res) => {
  User.findByIdAndRemove(req.params.id,
      (err, user) => {
      if (err) return res.status(500).send(err);
      const response = {
          message: `User ${user.name} successfully deleted`,
          id: user._id
      };
      return res.status(200).send(response)
  })
}
