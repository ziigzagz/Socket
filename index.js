var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
const port = 3005
const host = '0.0.0.0'

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

function check_referrer(referrer) {
  // true if referrer is not localhost
  // false if referrer is localhost
  if (referrer != 'http://localhost/') {
    return true
  }
  return false
}

io.on('connection', (socket) => {
  console.log('a user connected',socket.handshake.time)

  socket.on('disconnect', (res) => {
    console.log(`user is disconnected`, res)
  })

  socket.on('Create room ID', (res, callback) => {
    console.log('Created: ' + res.name)
    if (check_referrer(res.referrer)) {
      callback({
        status: 404,
      })
    }
    callback({
      status: 200,
    })

    socket.on(res.room, (data, callback) => {
      if (check_referrer(data.referrer)) {
        callback({
          status: 404,
        })
      }
      console.log(`room : ${res.room} `, data)
      if (data.msg.length <= 100) {
        io.emit(res.room, data)
      }
    })
  })
  // socket.on("private message", (anotherSocketId, msg) => {
  //   socket.to(anotherSocketId).emit("private message", socket.id, msg);
  //   console.log(anotherSocketId)
  // });
  //   socket.broadcast.emit('hi');
})

// io.of("/").adapter.on("create-room", (room) => {
//   console.log(`room ${room} was created`);
// });

io.of('/').adapter.on('join-room', (room, id) => {
  console.log(`socket ${id} has joined room ${room}`)
})

server.listen({ port: port, host: host }, () => {
  console.log(`listening on *:${port}`)
})
