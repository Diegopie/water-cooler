require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const routes = require('./routes');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.URL || 'http://localhost:3000', 
        methods: ['GET', 'POST']
    }
});

require('./config/db')();

const PORT = process.env.PORT || 5000;
const socketPORT = process.env.socketPORT || 8080;

// app.use(cors());

// parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

io.on('connect', (socket) => {
    socket.on('new-user', (roomUrlId, name) => {
        console.log('user connected in room: ' + roomUrlId);
        socket.join(roomUrlId);
        socket.to(roomUrlId).broadcast.emit('user-connected', roomUrlId, name);
    })
    
    socket.on('send-chat-message', (roomUrlId, name, messageInput) => {
        socket.to(roomUrlId).emit('receive-sent-message', roomUrlId, name, messageInput)
    })
    
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

app.listen(PORT, () => {
    console.log('app running on PORT: ' + PORT);
});

http.listen(socketPORT, () => {
    console.log('socket is running on port: ' + socketPORT)
});