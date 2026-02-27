const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let users = [];
let moderatorId = null;
let currentPhase = 'waiting'; // 'waiting', 'voting', 'revealed'
let currentCards = ['1', '2', '4', '6', '8', '12', '14', '?', '∞'];
let votes = {}; // { socketId: cardValue }

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (username) => {
        const user = { id: socket.id, username };
        users.push(user);

        if (!moderatorId) {
            moderatorId = socket.id;
            socket.emit('role', 'moderator');
            // Reset phase and votes when a new moderator starts the session (first user)
            currentPhase = 'waiting';
            votes = {};
        } else {
            socket.emit('role', 'voter');
        }

        io.emit('updateUsers', users.map(u => ({ ...u, hasVoted: !!votes[u.id] })));
        socket.emit('initData', { currentPhase, currentCards, isModerator: socket.id === moderatorId });
        
        if (currentPhase === 'revealed') {
            socket.emit('reveal', votes);
        }
    });

    socket.on('updateConfig', (newCards) => {
        if (socket.id === moderatorId) {
            currentCards = newCards;
            io.emit('configUpdated', currentCards);
        }
    });

    socket.on('startSession', () => {
        if (socket.id === moderatorId) {
            currentPhase = 'voting';
            votes = {};
            io.emit('sessionStarted');
            io.emit('updateUsers', users.map(u => ({ ...u, hasVoted: false })));
        }
    });

    socket.on('vote', (cardValue) => {
        if (currentPhase === 'voting') {
            votes[socket.id] = cardValue;
            io.emit('updateUsers', users.map(u => ({ ...u, hasVoted: !!votes[u.id] })));

            // Check if everyone has voted
            if (Object.keys(votes).length === users.length) {
                currentPhase = 'revealed';
                io.emit('reveal', votes);
            }
        }
    });

    socket.on('reset', () => {
        if (socket.id === moderatorId) {
            currentPhase = 'waiting';
            votes = {};
            io.emit('resetSession');
            io.emit('updateUsers', users.map(u => ({ ...u, hasVoted: false })));
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        users = users.filter(u => u.id !== socket.id);
        delete votes[socket.id];

        if (socket.id === moderatorId) {
            moderatorId = users.length > 0 ? users[0].id : null;
            if (moderatorId) {
                io.to(moderatorId).emit('role', 'moderator');
            }
        }

        io.emit('updateUsers', users.map(u => ({ ...u, hasVoted: !!votes[u.id] })));
        
        // If everyone left has voted in voting phase
        if (currentPhase === 'voting' && users.length > 0 && Object.keys(votes).length === users.length) {
            currentPhase = 'revealed';
            io.emit('reveal', votes);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
