const asyncHandler = require('express-async-handler')
const generateToken = require('../config/webTokens')
const User = require('../models/userModel')

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, pic } = req.body

  if (!username || !email || !password) {
    res.status(400)
    throw new Error('Please Enter valid information')
  }

  const userExists = await User.findOne({ username })

  if (userExists) {
    res.status(400)
    throw new Error('User already exist')
  }

  const user = await User.create({
    username,
    email,
    password,
    pic
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Could not create user, please try again later')
  }
})

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid username or password')
  }
})

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ]
  } : {}

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
  res.send(users)
})

module.exports = { registerUser, authUser, allUsers }
