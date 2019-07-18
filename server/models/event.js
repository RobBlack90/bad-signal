const mongoose = require('mongoose')
const {Schema} = mongoose

const EventSchema = new Schema({
  message : String,
  type : String,
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  created: { type: Date, default: Date.now },
}, { versionKey: false })

module.exports = mongoose.model('event', EventSchema)