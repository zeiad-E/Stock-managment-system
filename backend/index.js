const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { connectDB, sqliteDb } = require('./config/db');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
    sqliteDb.close();
    mongoose.connection.close();
    console.log('Database connections closed');
    process.exit(0);
});

startServer();