const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const moment = require('moment');

const { PORT } = require('./config.js');

// Default messages
const messages = [
  {
    user: {
      name: 'John',
      createdAt: moment().format()
    },
    message: 'Hello, World!',
    createdAt: moment().format('LT')
  },
  {
    user: {
      name: 'Rafael',
      createdAt: moment().format()
    },
    message: 'Oi',
    createdAt: moment().format('LT')
  },
  {
    user: {
      name: 'Marcos',
      createdAt: moment().format()
    },
    message: 'Salve',
    createdAt: moment().format('LT')
  },
];

app.use(express.static(__dirname + '/src'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/views/register.html');
});

app.get('/messages', (req, res) => {
  res.status(200).json({
    messages
  });
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
    messages.push(data);
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});