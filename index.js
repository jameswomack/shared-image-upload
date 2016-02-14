const Path = require('path')
const SioFU = require('socketio-file-upload')
const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server);

app.use(SioFU.router)

app.get('/', function (req, res) {
  res.sendFile(Path.join(__dirname, 'index.html'))
})

app.use(express.static('uploads'))

io.on('connection', socket => {
  const uploader = new SioFU()
  uploader.dir = Path.join(__dirname, 'uploads')
  uploader.listen(socket)

  uploader.on('saved', (o) => {
    io.emit('show', o)
  })

  socket.on('disconnect', () =>
    console.log('user disconnected'))
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
