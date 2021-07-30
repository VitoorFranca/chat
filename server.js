const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const moment = require('moment');

app.use(express.static(__dirname + '/src'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/views/register.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/src/views/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log('At ' + moment().format('L') + ' ' + moment().format('LT'));

    //  Message IO
  socket.on('chat message', (data) => {
    data.createdAt = `${moment().format('LT')}`;
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});