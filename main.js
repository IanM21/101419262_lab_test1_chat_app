import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { router } from './routes/routes.js';
import { GroupMessage } from './model/GroupMsg.js';
import { PrivateMessage } from './model/PrivateMsg.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chat_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.use('/api', router);

// Socket.IO Connection Handling
io.on('connection', (socket) => {
    console.log('New user connected');

    // Handle joining a room
    socket.on('join room', async (roomData) => {
        const { room, username } = roomData;
        socket.join(room);

        try {
            const messages = await GroupMessage.find({ room })
                .sort({ date_sent: 1 })
                .limit(50);

            const formattedMessages = messages.map(msg => ({
                username: msg.from_user,
                message: msg.message,
                date_sent: msg.date_sent
            }));

            socket.emit('message history', formattedMessages);
        } catch (error) {
            console.error('Error fetching message history:', error);
        }
    });

    // Handle chat messages
    socket.on('chat message', async (data) => {
        try {
            const { room, username, message } = data;

            // Save message to database
            const groupMessage = new GroupMessage({
                from_user: username,
                room: room,
                message: message,
                date_sent: new Date().toLocaleString()
            });
            await groupMessage.save();

            // Broadcast message to room with timestamp
            io.to(room).emit('message', {
                username: groupMessage.from_user,
                message: groupMessage.message,
                date_sent: groupMessage.date_sent
            });
        } catch (error) {
            console.error('Error saving/sending message:', error);
            socket.emit('error', { message: 'Error sending message' });
        }
    });

    socket.on('private typing', (data) => {
        io.to(data.to_user).emit('private typing', {
            username: data.username
        });
    });

    socket.on('private stop typing', (data) => {
        io.to(data.to_user).emit('private stop typing');
    });

    socket.on('private message', async (data) => {
        try {
            const { to_user, from_user, message } = data;

            // Save message
            const privateMessage = new PrivateMessage({
                from_user,
                to_user,
                message
            });
            await privateMessage.save();

            // Send to recipient
            io.to(to_user).emit('private message', {
                from_user,
                message,
                date_sent: privateMessage.date_sent
            });

            // Send back to sender
            socket.emit('private message', {
                from_user,
                message,
                date_sent: privateMessage.date_sent
            });
        } catch (error) {
            console.error('Error saving/sending private message:', error);
            socket.emit('error', { message: 'Error sending private message' });
        }
    });

    // private message 
    socket.on('register user', (username) => {
        socket.join(username);
    });

    // typing indicator
    socket.on('typing', (data) => {
        socket.to(data.room).emit('typing', {
            username: data.username
        });
    });

    // stop typing
    socket.on('stop typing', (data) => {
        socket.to(data.room).emit('stop typing');
    });

    // leaving room
    socket.on('leave room', (data) => {
        const { room, username } = data;
        socket.leave(room);
        socket.to(room).emit('user left', {
            username: username,
            message: `${username} has left the room`
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});