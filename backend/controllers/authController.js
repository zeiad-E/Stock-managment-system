const jwt = require('jsonwebtoken');
const User = require('../models/sqlite/User');

const SECRET_KEY = process.env.SECRET_KEY || 'fallback-secret-change-in-prod';

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const user = await User.create({ username, password });
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
        res.status(201).json({ token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};