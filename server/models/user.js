const mongoose = require('mongoose')
const {Schema} = mongoose

const UserSchema = new Schema({
  name : String,
  isOnline : {type: Boolean, default: false },
  status : String
}, { versionKey: false })

module.exports = mongoose.model('user', UserSchema)