const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { connectMongo } = require('./config/db');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
connectMongo();

// Routes
app.use('/api', apiRoutes);

// Start
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
    const mongoose = require('mongoose');
    const { dbSqlite } = require('./config/db');
    dbSqlite.close();
    mongoose.connection.close();
    process.exit(0);
});