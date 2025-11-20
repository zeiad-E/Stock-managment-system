const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
require('dotenv').config();

// SQLite Connection
const sqliteDb = new sqlite3.Database('database.db', (err) => {
    if (err) console.error('SQLite Error:', err.message);
    else {
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);
        console.log('SQLite ready (users table)');
    }
});

// MongoDB Connection
const MONGO_URI = `mongodb+srv://3abasst:${process.env.DB_PASSWORD}@cluster0.rdezj9y.mongodb.net/inventoryDB?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Atlas connected (business data)');
        return mongoose.connection;
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};

module.exports = {
    sqliteDb,
    connectDB,
    mongoose
};