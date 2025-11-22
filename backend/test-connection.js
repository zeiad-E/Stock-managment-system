require('dotenv').config();
const mongoose = require('mongoose');
// const MONGO_URI = `mongodb://3abasst:${process.env.DB_PASSWORD}@cluster0.rdezj9y.mongodb.net/inventoryDB?retryWrites=true&w=majority`;
const MONGO_URI = `mongodb+srv://3abasst:${process.env.DB_PASSWORD}@cluster0.rdezj9y.mongodb.net/inventoryDB?retryWrites=true&w=majority`;

console.log('Testing MongoDB connection...');
console.log('Connection string:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });