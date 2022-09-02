const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default: 'https://img.icons8.com/material/480/person-male.png'
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
