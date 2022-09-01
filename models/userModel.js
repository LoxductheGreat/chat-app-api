const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      defualt: 'https://img.icons8.com/material/480/person-male.png'
    }
  },
  { timeStamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
