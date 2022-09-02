const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

const app = express()
dotenv.config()
connectDB()

app.get('/', (req, res) => {
  res.send('Api is running')
})

const PORT = process.env.PORT || 2500

app.listen(2500, console.log(`Server is running on Port ${PORT}`))
