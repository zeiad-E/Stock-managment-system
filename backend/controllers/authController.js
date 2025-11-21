const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dbSqlite } = require('../config/db');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'fallback-secret';

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const hashed = await bcrypt.hash(password, 10);
    dbSqlite.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], function (err) {
        if (err) return res.status(400).json({ error: 'Username already exists' });
        res.status(201).json({ message: 'User registered' });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Credentials required' });

    dbSqlite.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (err || !row || !(await bcrypt.compare(password, row.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    });
};