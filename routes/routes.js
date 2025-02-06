import express from 'express';
import { User } from '../model/User.js';
import { GroupMessage } from '../model/GroupMsg.js';
import bcrypt from 'bcrypt';

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = new User({
            username,
            firstname,
            lastname,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

router.get('/messages/:room', async (req, res) => {
    try {
        const messages = await GroupMessage.find({ room: req.params.room })
            .sort({ date_sent: 1 })
            .limit(50);

        const formattedMessages = messages.map(msg => ({
            username: msg.from_user,
            message: msg.message,
            date_sent: msg.date_sent
        }));

        res.json(formattedMessages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

export { router };