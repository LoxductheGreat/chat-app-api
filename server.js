const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')

const app = express()
dotenv.config()
connectDB()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Api is running')
})

app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 2500

app.listen(2500, console.log(`Server is running on Port ${PORT}`))
