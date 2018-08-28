const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    password: String,
    role: {
      type: String,
      enum : ['Boss', 'Developer', 'TA'],
      default : 'TA'}
})

module.exports = mongoose.model('User', userSchema)
