const mongoose = require('mongoose');
const Product = require('../models/mongo/Product');
const Customer = require('../models/mongo/Customer');
const Supplier = require('../models/mongo/Supplier');
const Stock = require('../models/mongo/Stock');

const seedData = {
    customers: [
        { "_id": "c1", "name": "El Nour Supermarket", "contactPerson": "Mahmoud", "phone": "0100001122", "address": "Alexandria", "notes": "Prefers weekly delivery" },
        
    ],
    
};

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Promise.all([
            Customer.deleteMany({}),
            Product.deleteMany({}),
            
        ]);

        // Insert seed data
        await Promise.all([
            Customer.insertMany(seedData.customers),
            
        ]);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run seed if this file is executed directly
if (require.main === module) {
    require('dotenv').config();
    const { connectDB } = require('../config/db');
    connectDB().then(() => seedDatabase());
}

module.exports = seedDatabase;