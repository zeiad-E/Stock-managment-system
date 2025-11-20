const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// 1. SQLite (Users & Auth) - unchanged
// ========================
const db = new sqlite3.Database('database.db', (err) => {
    if (err) console.error('SQLite Error:', err.message);
    else {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);
        console.log('SQLite ready (users table)');
    }
});

const SECRET_KEY = process.env.SECRET_KEY || 'fallback-secret-change-in-prod';

// ========================
// 2. MongoDB Atlas Connection
// ========================
const MONGO_URI = `mongodb+srv://3abasst:${process.env.DB_PASSWORD}@cluster0.rdezj9y.mongodb.net/inventoryDB?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI)  // ← Removed deprecated options
    .then(() => console.log('MongoDB Atlas connected (business data)'))
    .catch(err => console.error('MongoDB connection failed:', err));

// ========================
// IMPORTANT: Schemas with { _id: String } and autoIndex/autoCreate
// ========================
const stringIdSchema = {
    _id: String,          // ← This is the key fix
    ...mongoose.Schema.Types.Mixed
};

const createModel = (name, collection) => {
    const schema = new mongoose.Schema({}, {
        strict: false,
        _id: false,       // ← Prevent Mongoose from forcing ObjectId
        collection
    });
    // Override _id to accept strings
    schema.add({ _id: String });
    return mongoose.model(name, schema, collection);
};

const Customer = createModel('Customer', 'customers');
const CustomerBill = createModel('CustomerBill', 'customer_bills');
const Expense = createModel('Expense', 'expenses');
const Product = createModel('Product', 'products');
const Return = createModel('Return', 'returns');
const Stock = createModel('Stock', 'stock');
const Supplier = createModel('Supplier', 'suppliers');
const SupplierBill = createModel('SupplierBill', 'supplier_bills');

// ========================
// Seed Data (now works with string _id)
// ========================
async function seedMongoDB() {
    const seedData = {
        customers: [
            { "_id": "c1", "name": "El Nour Supermarket", "contactPerson": "Mahmoud", "phone": "0100001122", "address": "Alexandria", "notes": "Prefers weekly delivery", "createdAt": new Date("2025-01-01") },
            { "_id": "c2", "name": "Happy Mart", "contactPerson": "Sara", "phone": "0100003344", "address": "Cairo", "notes": "Buys in bulk", "createdAt": new Date("2025-01-01") },
            { "_id": "c3", "name": "Fresh Market", "contactPerson": "Omar", "phone": "0100005566", "address": "Giza", "notes": "Pays monthly", "createdAt": new Date("2025-01-01") },
            { "_id": "c4", "name": "Family Groceries", "contactPerson": "Mariam", "phone": "0100007788", "address": "Alexandria", "notes": "Needs receipts with each order", "createdAt": new Date("2025-01-01") },
            { "_id": "c5", "name": "City Corner Shop", "contactPerson": "Youssef", "phone": "0100009900", "address": "Cairo", "notes": "Small orders, frequent", "createdAt": new Date("2025-01-01") }
        ],
        expenses: [
            { "_id": "ex1", "type": "transport", "amount": 200, "date": new Date("2025-01-03"), "notes": "Fuel for delivery car" },
            { "_id": "ex2", "type": "electricity", "amount": 350, "date": new Date("2025-01-04"), "notes": "Monthly bill" },
            { "_id": "ex3", "type": "packaging", "amount": 120, "date": new Date("2025-01-05"), "notes": "Plastic bags" },
            { "_id": "ex4", "type": "maintenance", "amount": 500, "date": new Date("2025-01-06"), "notes": "Shelves repair" }
        ],
        products: [
            { "_id": "p1", "name": "Chips 50g", "category": "Snacks", "buyPrice": 3.5, "sellPrice": 5, "barcode": "1111111111111", "supplierId": "s1", "createdAt": new Date("2025-01-01"), "updatedAt": new Date("2025-01-01") },
            { "_id": "p2", "name": "Chocolate Bar", "category": "Confectionery", "buyPrice": 7, "sellPrice": 10, "barcode": "2222222222222", "supplierId": "s2", "createdAt": new Date("2025-01-01"), "updatedAt": new Date("2025-01-01") },
            { "_id": "p3", "name": "Orange Juice 250ml", "category": "Drinks", "buyPrice": 6, "sellPrice": 9, "barcode": "3333333333333", "supplierId": "s1", "createdAt": new Date("2025-01-01"), "updatedAt": new Date("2025-01-01") },
            { "_id": "p4", "name": "Pasta 500g", "category": "Groceries", "buyPrice": 10, "sellPrice": 15, "barcode": "4444444444444", "supplierId": "s3", "createdAt": new Date("2025-01-01"), "updatedAt": new Date("2025-01-01") },
            { "_id": "p5", "name": "Milk 1L", "category": "Dairy", "buyPrice": 18, "sellPrice": 25, "barcode": "5555555555555", "supplierId": "s2", "createdAt": new Date("2025-01-01"), "updatedAt": new Date("2025-01-01") }
        ],
        stock: [
            { "_id": "b1", "productId": "p1", "quantity": 100, "expiryDate": new Date("2025-03-01"), "supplierId": "s1" },
            { "_id": "b2", "productId": "p2", "quantity": 80, "expiryDate": new Date("2025-04-10"), "supplierId": "s2" },
            { "_id": "b3", "productId": "p3", "quantity": 50, "expiryDate": new Date("2025-02-15"), "supplierId": "s1" },
            { "_id": "b4", "productId": "p4", "quantity": 120, "expiryDate": new Date("2025-12-01"), "supplierId": "s3" },
            { "_id": "b5", "productId": "p5", "quantity": 60, "expiryDate": new Date("2025-01-20"), "supplierId": "s2" }
        ],
        suppliers: [
            { "_id": "s1", "name": "Golden Snacks Co.", "contactPerson": "Ali", "phone": "0100000001", "email": "info@golden.com", "address": "Alexandria", "notes": "Fast delivery" },
            { "_id": "s2", "name": "Fresh Drinks Ltd.", "contactPerson": "Mona", "phone": "0100000002", "email": "contact@fresh.com", "address": "Cairo", "notes": "Competitive prices" },
            { "_id": "s3", "name": "Daily Foods", "contactPerson": "Hassan", "phone": "0100000003", "email": "support@dailyfoods.com", "address": "Giza", "notes": "Bulk discounts" }
        ],
        customer_bills: [
            {
                "_id": "inv1",
                "customerId": "c1",
                "date": new Date("2025-01-02"),
                "items": [
                    { "productId": "p1", "quantity": 20, "salePrice": 5, "total": 100, "batchRefs": ["b1", "b1"] },
                    { "productId": "p3", "quantity": 10, "salePrice": 9, "total": 90 }
                ],
                "grandTotal": 190,
                "paymentStatus": "unpaid",
                "notes": "Monthly buyer"
            }
        ],
        supplier_bills: [
            {
                "_id": "bill1",
                "supplierId": "s1",
                "date": new Date("2025-01-01"),
                "items": [
                    { "productId": "p1", "batchId": "b7", "quantity": 100, "unitPrice": 3.5, "total": 350 },
                    { "productId": "p3", "batchId": "b8", "quantity": 50, "unitPrice": 6, "total": 300 }
                ],
                "grandTotal": 650,
                "paymentStatus": "paid",
                "notes": "January delivery"
            }
        ],
        returns: [
            {
                "_id": "r1",
                "type": "customer",
                "date": new Date("2025-01-05"),
                "customerId": "c1",
                "supplierId": "s1",
                "items": [{ "productId": "p1", "batchId": "b1", "quantity": 5, "reason": "Damaged package" }],
                "relatedInvoiceId": "inv3",
                "relatedBillId": "bill2",
                "refundAmount": 25,
                "notes": "Customer complained about damaged bags"
            }
        ]
    };

    for (const [key, items] of Object.entries(seedData)) {
        const Model = mongoose.models[key.charAt(0).toUpperCase() + key.slice(1)] ||
            mongoose.model(key.charAt(0).toUpperCase() + key.slice(1), new mongoose.Schema({}, { strict: false, _id: false, collection: key }));

        if (await Model.countDocuments() === 0) {
            console.log(`Seeding ${key}...`);
            await Model.insertMany(items);
        }
    }
    console.log('All seed data inserted successfully!');
}

seedMongoDB().catch(err => console.error('Seed error:', err));

// ========================
// Auth Routes (SQLite) - unchanged
// ========================
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const hashed = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], function (err) {
        if (err) return res.status(400).json({ error: 'Username already exists' });
        res.status(201).json({ message: 'User registered' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Credentials required' });

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (err || !row || !(await bcrypt.compare(password, row.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    });
});

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;
        next();
    });
}

// Example routes
app.get('/api/customers', verifyToken, async (req, res) => {
    res.json(await Customer.find());
});

app.get('/api/products', verifyToken, async (req, res) => {
    res.json(await Product.find());
});

// app.post('/upload', verifyToken, async (req, res) => {
//     if (!req.files || !req.files.image) return res.status(400).json({ error: 'No image uploaded' });

//     const image = req.files.image;
//     const form = new FormData();
//     form.append('image', image.data, image.name);

//     try {
//         const aiResponse = await axios.post('http://localhost:5000/process_image', form, {
//             headers: form.getHeaders()
//         });
//         res.json(aiResponse.data);
//     } catch (error) {
//         console.error('AI Server Error:', error.message);
//         res.status(500).json({ error: 'Failed to process image' });
//     }
// });

app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close();
    mongoose.connection.close();
    process.exit(0);
});