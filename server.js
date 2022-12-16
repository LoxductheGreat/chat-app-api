const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middleware/errormiddleware')

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
const corsOptions = {
  origin: 'https://chatify-chat-talking-app.netlify.app', // 'http://localhost:3000'
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('Api is running')
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 2500

const server = app.listen(PORT, console.log(`Server is running on Port ${PORT}`))

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'https://chatify-chat-talking-app.netlify.app/' // 'http://localhost:3000'
  }
})

io.on('connection', (socket) => {
  console.log('connected to socket.io')

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log('User joined room: ' + room)
  })

  socket.on('typing', (room) => socket.in(room).emit('typing'))
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

  socket.on('new message', (newMessageRecieved) => {
    const chat = newMessageRecieved.chat

    if (!chat.users) return console.log('chat.users not defined')

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return

      socket.in(user._id).emit('message recieved', newMessageRecieved)
    })
  })

  socket.off('setup', () => {
    console.log('User left channel')
    socket.leave(userData._id)
  })
})
