const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const msgHeader = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Ustawienie folderu public jako statyczny, żeby otwierać index.html z folderu
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Group Chat Project Bot';

// Dołączanie do pokoju
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

    // Powitanie dla usera który dołączył do czatu
    socket.emit('message', msgHeader(botName, 'Witaj na czacie!'));

    // Info kiedy user odchodzi z czatu
    socket.broadcast.to(user.room).emit('message', msgHeader(botName, `${user.username} dołączył do czatu!`));
    
        // Update tabelki z boku kiedy dołączy
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Odbieranie wiadomości
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', msgHeader(user.username, msg));
    });
        
    // Info kiedy user odchodzi z czatu
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('message', msgHeader(botName, `${user.username} opuścił czat.node`));

                // Update tabelki z boku kiedy odejdzie
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));