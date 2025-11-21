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

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Atlas connected (business data)');
        await seedMongoDB();
    })
    .catch((err) => console.error('MongoDB connection failed:', err));

// ========================
// 3. Mongoose Models (string _id, strict: false)
// ========================
// ======================== FIXED MODEL CREATOR (POPULATE WORKS!) ========================
// function createModel(modelName, collectionName) {
//     const schema = new mongoose.Schema(
//         {
//             _id: { type: String, required: true },
//             // Add common reference fields so populate never complains
//             customerId: { type: String, ref: 'Customer' },
//             supplierId: { type: String, ref: 'Supplier' },
//             productId: { type: String, ref: 'Product' },
//             // For nested arrays in bills
//             items: [{
//                 productId: { type: String, ref: 'Product' },
//                 batchRefs: [{ batchId: String }]
//             }]
//         },
//         {
//             strict: false,
//             collection: collectionName,
//             strictPopulate: false   // ← THIS IS THE KEY LINE!
//         }
//     );

//     // This is the magic line that disables the strict populate check globally for this schema
//     schema.set('strictPopulate', false);

//     return mongoose.model(modelName, schema, collectionName);
// }

// const Customer = createModel('Customer', 'customers');
// const CustomerBill = createModel('CustomerBill', 'customer_bills');
// const Expense = createModel('Expense', 'expenses');
// const Product = createModel('Product', 'products');
// const ReturnModel = createModel('Return', 'returns');
// const Stock = createModel('Stock', 'stock');
// const Supplier = createModel('Supplier', 'suppliers');
// const SupplierBill = createModel('SupplierBill', 'supplier_bills');

// // After defining all models
// [Customer, CustomerBill, Product, Stock, Supplier, SupplierBill, ReturnModel].forEach(model => {
//     if (model && model.schema) {
//         model.schema.set('strictPopulate', false);
//     }
// });

// ========================
// CORRECT MONGOOSE MODELS
// ========================

// Product Model
const ProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  category: String,
  buyPrice: Number,
  sellPrice: Number,
  barcode: String,
  supplierId: { type: String, ref: "Supplier" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Product = mongoose.model("Product", ProductSchema, "products");

// Customer Model
const CustomerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  contactPerson: String,
  phone: String,
  address: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Customer = mongoose.model("Customer", CustomerSchema, "customers");

// Supplier Model
const SupplierSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  contactPerson: String,
  phone: String,
  email: String,
  address: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Supplier = mongoose.model("Supplier", SupplierSchema, "suppliers");

// Stock Model (Batches)
const StockSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  productId: { type: String, ref: "Product", required: true },
  supplierId: { type: String, ref: "Supplier" },
  quantity: { type: Number, required: true },
  unitPrice: Number,
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Stock = mongoose.model("Stock", StockSchema, "stock");

// Customer Bill (Invoice)
const CustomerBillSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  customerId: { type: String, ref: "Customer", required: true },
  date: { type: Date, default: Date.now },
  items: [{
    productId: { type: String, ref: "Product", required: true },
    quantity: Number,
    salePrice: Number,
    total: Number,
    batchRefs: [{
      batchId: { type: String, ref: "Stock" },
      quantityTaken: Number
    }]
  }],
  grandTotal: Number,
  paymentStatus: String,
  notes: String
});
const CustomerBill = mongoose.model("CustomerBill", CustomerBillSchema, "customer_bills");

// Supplier Bill
const SupplierBillSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  supplierId: { type: String, ref: "Supplier", required: true },
  date: { type: Date, default: Date.now },
  items: [{
    productId: { type: String, ref: "Product" },
    batchId: { type: String, ref: "Stock" },
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  grandTotal: Number,
  paymentStatus: String,
  notes: String
});
const SupplierBill = mongoose.model("SupplierBill", SupplierBillSchema, "supplier_bills");

// Returns
const ReturnSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ["customer", "supplier"], required: true },
  customerId: { type: String, ref: "Customer" },
  supplierId: { type: String, ref: "Supplier" },
  date: { type: Date, default: Date.now },
  items: [{
    productId: { type: String, ref: "Product" },
    quantity: Number,
    reason: String,
    batchRefs: [{
      batchId: { type: String, ref: "Stock" },
      quantity: Number
    }]
  }],
  relatedInvoiceId: { type: String, ref: "CustomerBill" },
  relatedBillId: { type: String, ref: "SupplierBill" },
  refundAmount: Number,
  notes: String
});
const ReturnModel = mongoose.model("Return", ReturnSchema, "returns");

// Expense
const ExpenseSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: String,
  amount: Number,
  date: Date,
  notes: String
});
const Expense = mongoose.model("Expense", ExpenseSchema, "expenses");

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

    const collectionMap = {
        customers: Customer,
        expenses: Expense,
        products: Product,
        stock: Stock,
        suppliers: Supplier,
        customer_bills: CustomerBill,
        supplier_bills: SupplierBill,
        returns: ReturnModel
    };

    for (const [collectionName, items] of Object.entries(seedData)) {
        const Model = collectionMap[collectionName];
        if (!Model) {
            console.log(`Skipping unknown collection: ${collectionName}`);
            continue;
        }

        const count = await Model.countDocuments();
        if (count === 0) {
            console.log(`Seeding ${collectionName}...`);
            await Model.insertMany(items);
        }
    }

    console.log('All seed data inserted successfully!');
}

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

// ======================== PRODUCT APIs - DESCRIPTIVE PATHS ========================

// Create a new product
app.post('/api/products/create', verifyToken, async (req, res) => {
    try {
        const { _id, name, category, buyPrice, sellPrice, barcode, supplierId } = req.body;

        if (!_id || !name) {
            return res.status(400).json({ error: "Product _id and name are required" });
        }

        const now = new Date();
        const product = await Product.create({
            _id,
            name,
            category,
            buyPrice: Number(buyPrice),
            sellPrice: Number(sellPrice),
            barcode,
            supplierId,
            createdAt: now,
            updatedAt: now
        });

        res.status(201).json({ message: "Product created successfully", product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create product", details: err.message });
    }
});

// Get all products (with optional sorting)
app.get('/api/products/list', verifyToken, async (req, res) => {
    try {
        const { sortBy = "name", order = "asc" } = req.query;
        const sortOrder = order === "desc" ? -1 : 1;

        const products = await Product.find().sort({ [sortBy]: sortOrder });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Get single product by ID
app.get('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

// Update product
app.put('/api/products/update/:id', verifyToken, async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: new Date() };
        const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!updated) return res.status(404).json({ error: "Product not found" });

        res.json({ message: "Product updated successfully", product: updated });
    } catch (err) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

// Delete product
app.delete('/api/products/delete/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Product not found" });

        res.json({ message: "Product deleted successfully", deleted });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// Filter by date range (updatedAt)
app.get('/api/products/filter/by-date', verifyToken, async (req, res) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) return res.status(400).json({ error: "'from' and 'to' dates are required" });

        const products = await Product.find({
            updatedAt: { $gte: new Date(from), $lte: new Date(to) }
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter products by date" });
    }
});

// Filter by price range (buyPrice or sellPrice)
app.get('/api/products/filter/by-price', verifyToken, async (req, res) => {
    try {
        const { type = "sellPrice", min, max } = req.query;

        if (!["sellPrice", "buyPrice"].includes(type)) {
            return res.status(400).json({ error: "type must be 'sellPrice' or 'buyPrice'" });
        }
        if (!min && !max) {
            return res.status(400).json({ error: "Provide at least min or max" });
        }

        const query = {};
        if (min) query[type] = { ...query[type], $gte: Number(min) };
        if (max) query[type] = { ...query[type], $lte: Number(max) };

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter by price" });
    }
});

// Filter by category
app.get('/api/products/filter/by-category', verifyToken, async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) return res.status(400).json({ error: "category parameter is required" });

        const products = await Product.find({ category: category });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter by category" });
    }
});

// Filter by supplier
app.get('/api/products/filter/by-supplier', verifyToken, async (req, res) => {
    try {
        const { supplierId } = req.query;
        if (!supplierId) return res.status(400).json({ error: "supplierId parameter is required" });

        const products = await Product.find({ supplierId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter by supplier" });
    }
});

// Search products by name (partial match)
app.get('/api/products/search', verifyToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Search query 'q' is required" });

        const products = await Product.find({
            name: { $regex: q, $options: 'i' } // case-insensitive
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});
//=================================================================================
// ======================== CUSTOMER APIs - DESCRIPTIVE & CLEAN ========================

// Create a new customer
app.post('/api/customers/create', verifyToken, async (req, res) => {
    try {
        const { _id, name, contactPerson, phone, address, notes } = req.body;

        if (!_id || !name) {
            return res.status(400).json({ error: "_id and name are required" });
        }

        const customer = await Customer.create({
            _id,
            name,
            contactPerson,
            phone,
            address,
            notes,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({ 
            message: "Customer created successfully", 
            customer 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create customer", details: err.message });
    }
});

// Get all customers (with sorting support)
app.get('/api/customers/list', verifyToken, async (req, res) => {
    try {
        const { sortBy = "name", order = "asc" } = req.query;
        const sortOrder = order === "desc" ? -1 : 1;

        const customers = await Customer.find().sort({ [sortBy]: sortOrder });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});

// Get single customer by ID
app.get('/api/customers/:id', verifyToken, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch customer" });
    }
});

// Update customer
app.put('/api/customers/update/:id', verifyToken, async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: new Date() };
        const customer = await Customer.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!customer) return res.status(404).json({ error: "Customer not found" });

        res.json({ message: "Customer updated successfully", customer });
    } catch (err) {
        res.status(500).json({ error: "Failed to update customer" });
    }
});

// Delete customer
app.delete('/api/customers/delete/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Customer.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Customer not found" });

        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete customer" });
    }
});

// Filter customers by city (address field)
app.get('/api/customers/filter/by-city', verifyToken, async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ error: "'city' parameter is required" });

        const customers = await Customer.find({ 
            address: { $regex: new RegExp(city, 'i') }  // case-insensitive partial match
        });

        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter by city" });
    }
});

// Search customers by name or contact person
app.get('/api/customers/search', verifyToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Search query 'q' is required" });

        const customers = await Customer.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { contactPerson: { $regex: q, $options: 'i' } },
                { phone: { $regex: q } }
            ]
        });

        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});

// Filter by phone number (exact or partial)
app.get('/api/customers/filter/by-phone', verifyToken, async (req, res) => {
    try {
        const { phone } = req.query;
        if (!phone) return res.status(400).json({ error: "'phone' parameter is required" });

        const customers = await Customer.find({ 
            phone: { $regex: phone, $options: 'i' } 
        });

        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter by phone" });
    }
});

//==================================================================================
// ======================== STOCK (BATCHES) APIs - CLEAN & DESCRIPTIVE ========================

// Get all stock batches (sorted by expiry date ascending)
app.get('/api/stock/batches/list', verifyToken, async (req, res) => {
    try {
        const batches = await Stock.find().sort({ expiryDate: 1 });
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve stock batches" });
    }
});

// Get stock batches for a specific product
app.get('/api/stock/batches/by-product/:productId', verifyToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const batches = await Stock.find({ productId }).sort({ expiryDate: 1 });
        res.json(batches);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve product batches" });
    }
});

// Get single batch by ID
app.get('/api/stock/batches/:batchId', verifyToken, async (req, res) => {
    try {
        const batch = await Stock.findById(req.params.batchId);
        if (!batch) return res.status(404).json({ error: "Batch not found" });
        res.json(batch);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch batch" });
    }
});
// Add new stock batch (manual entry) - WITH PRODUCT VALIDATION
// app.post('/api/stock/batches/create', verifyToken, async (req, res) => {
//     try {
//         const { _id, productId, quantity, expiryDate, supplierId, unitPrice } = req.body;

//         // Required fields check
//         if (!_id || !productId || !quantity || !expiryDate) {
//             return res.status(400).json({ 
//                 error: "_id, productId, quantity and expiryDate are required" 
//             });
//         }

//         // === CRITICAL: Check if the product actually exists ===
//         const productExists = await Product.findById(productId);
//         if (!productExists) {
//             return res.status(400).json({ 
//                 error: "Cannot create batch: Product with this productId does not exist",
//                 invalidProductId: productId
//             });
//         }

//         // Optional: Also validate supplier if provided
//         if (supplierId) {
//             const supplierExists = await Supplier.findById(supplierId);
//             if (!supplierExists) {
//                 return res.status(400).json({ 
//                     error: "Supplier with this supplierId does not exist",
//                     invalidSupplierId: supplierId
//                 });
//             }
//         }

//         // All good → create the batch
//         const batch = await Stock.create({
//             _id,
//             productId,
//             quantity: Number(quantity),
//             expiryDate: new Date(expiryDate),
//             supplierId: supplierId || null,
//             unitPrice: unitPrice ? Number(unitPrice) : null
//         });

//         // Populate product name for nicer response (optional but super useful for frontend)
//         // const populatedBatch = await Stock.findById(batch._id)
//         //     .populate('productId', 'name category')
//         //     .populate('supplierId', 'name');

//         res.status(201).json({ 
//             message: "Stock batch created successfully", 
//             batch: populatedBatch || batch 
//         });

//     } catch (err) {
//         console.error("Error creating stock batch:", err);
//         res.status(500).json({ 
//             error: "Failed to create batch", 
//             details: err.message 
//         });
//     }
// });
// Update existing batch
app.put('/api/stock/batches/update/:batchId', verifyToken, async (req, res) => {
    try {
        const updated = await Stock.findByIdAndUpdate(
            req.params.batchId,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "Batch not found" });

        res.json({ message: "Batch updated successfully", batch: updated });
    } catch (err) {
        res.status(500).json({ error: "Failed to update batch" });
    }
});

// Delete batch
app.delete('/api/stock/batches/delete/:batchId', verifyToken, async (req, res) => {
    try {
        const deleted = await Stock.findByIdAndDelete(req.params.batchId);
        if (!deleted) return res.status(404).json({ error: "Batch not found" });

        res.json({ message: "Batch deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete batch" });
    }
});

// Low stock alert (configurable threshold)
app.get('/api/stock/alerts/low-stock', verifyToken, async (req, res) => {
    try {
        const threshold = Number(req.query.threshold) || 20;

        const products = await Product.find();
        const lowStockItems = await Promise.all(
            products.map(async (p) => {
                const batches = await Stock.find({ productId: p._id });
                const totalQty = batches.reduce((sum, b) => sum + b.quantity, 0);

                if (totalQty <= threshold) {
                    return {
                        productId: p._id,
                        productName: p.name,
                        currentStock: totalQty,
                        threshold
                    };
                }
            })
        );

        res.json(lowStockItems.filter(Boolean));
    } catch (err) {
        res.status(500).json({ error: "Failed to generate low stock alerts" });
    }
});

// Expiring soon alert (default: next 30 days)
app.get('/api/stock/alerts/expiring-soon', verifyToken, async (req, res) => {
    try {
        const days = Number(req.query.days) || 30;
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() + days);

        const expiringBatches = await Stock.find({
            expiryDate: { $lte: limitDate, $gte: new Date() }
        })
        .populate('productId', 'name')
        .sort({ expiryDate: 1 });

        res.json(expiringBatches.map(b => ({
            batchId: b._id,
            productName: b.productId?.name || 'Unknown',
            quantity: b.quantity,
            expiryDate: b.expiryDate,
            daysLeft: Math.ceil((new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
        })));
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch expiring batches" });
    }
});

// Human-friendly stock summary per product
app.get('/api/stock/summary/per-product', verifyToken, async (req, res) => {
    try {
        const products = await Product.find();
        const summary = await Promise.all(
            products.map(async (p) => {
                const batches = await Stock.find({ productId: p._id });
                const totalQty = batches.reduce((sum, b) => sum + b.quantity, 0);
                const validBatches = batches.filter(b => b.expiryDate > new Date());
                const earliestExpiry = validBatches.length > 0
                    ? validBatches.reduce((min, b) => b.expiryDate < min ? b.expiryDate : min, validBatches[0].expiryDate)
                    : null;

                return {
                    productId: p._id,
                    productName: p.name,
                    category: p.category,
                    totalStock: totalQty,
                    availableStock: validBatches.reduce((sum, b) => sum + b.quantity, 0),
                    expiredStock: totalQty - validBatches.reduce((sum, b) => sum + b.quantity, 0),
                    earliestExpiryDate: earliestExpiry ? earliestExpiry.toISOString().split('T')[0] : null
                };
            })
        );

        res.json(summary.filter(s => s.totalStock > 0));
    } catch (err) {
        res.status(500).json({ error: "Failed to generate stock summary" });
    }
});
//==================================================================================

//===================================================================================
// Supplier APIs

// ======================== SUPPLIER APIs - CLEAN & DESCRIPTIVE ========================

// Create a new supplier
app.post('/api/suppliers/create', verifyToken, async (req, res) => {
    try {
        const { _id, name, contactPerson, phone, email, address, notes } = req.body;

        if (!_id || !name) {
            return res.status(400).json({ 
                error: "_id and name are required" 
            });
        }

        // Optional: Prevent duplicate supplier name
        const existing = await Supplier.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (existing) {
            return res.status(400).json({ 
                error: "A supplier with this name already exists" 
            });
        }

        const supplier = await Supplier.create({
            _id,
            name,
            contactPerson,
            phone,
            email,
            address,
            notes,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({ 
            message: "Supplier created successfully", 
            supplier 
        });
    } catch (err) {
        console.error("Error creating supplier:", err);
        res.status(500).json({ 
            error: "Failed to create supplier", 
            details: err.message 
        });
    }
});

// Get all suppliers (with sorting)
app.get('/api/suppliers/list', verifyToken, async (req, res) => {
    try {
        const { sortBy = "name", order = "asc" } = req.query;
        const sortOrder = order === "desc" ? -1 : 1;

        const suppliers = await Supplier.find().sort({ [sortBy]: sortOrder });
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
});

// Get single supplier by ID
app.get('/api/suppliers/:id', verifyToken, async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ error: "Supplier not found" });
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch supplier" });
    }
});

// Update supplier
app.put('/api/suppliers/update/:id', verifyToken, async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: new Date() };
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!supplier) return res.status(404).json({ error: "Supplier not found" });

        res.json({ 
            message: "Supplier updated successfully", 
            supplier 
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to update supplier" });
    }
});

// Delete supplier
app.delete('/api/suppliers/delete/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Supplier.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Supplier not found" });

        res.json({ message: "Supplier deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete supplier" });
    }
});

// Filter suppliers by city/address (partial match)
app.get('/api/suppliers/filter/by-city', verifyToken, async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ error: "'city' parameter is required" });

        const suppliers = await Supplier.find({
            address: { $regex: city, $options: 'i' }  // case-insensitive partial match
        });

        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter suppliers by city" });
    }
});

// Search suppliers (by name, contact person, phone, or email)
app.get('/api/suppliers/search', verifyToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Search query 'q' is required" });

        const suppliers = await Supplier.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { contactPerson: { $regex: q, $options: 'i' } },
                { phone: { $regex: q } },
                { email: { $regex: q, $options: 'i' } }
            ]
        });

        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});
//===================================================================================
// ================================
// CUSTOMER BILL - CREATE SALE (FIFO)
// ================================
// ===============================
// ===============================
// Customer Bill (SELL) with FIFO
// ===============================
// ================================
// CUSTOMER SALE - FIFO (NOW REALLY UPDATES STOCK!)
// ================================
// FINAL 100% WORKING SELL ROUTE – STOCK UPDATES + POPULATE WORKS!
app.post('/api/customer-bills/sell', verifyToken, async (req, res) => {
    try {
        const { customerId, items, notes, paymentStatus = "unpaid" } = req.body;

        if (!customerId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "customerId and items[] are required" });
        }

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        for (const it of items) {
            if (!it.productId || !it.quantity || !it.salePrice || it.quantity <= 0) {
                return res.status(400).json({ error: "Each item needs productId, quantity (>0), salePrice" });
            }
        }

        const invoiceId = `inv_${Date.now()}`;
        let grandTotal = 0;
        const invoiceItems = [];

        for (const it of items) {
            const { productId, quantity: qtyToSell, salePrice } = it;

            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ error: `Product not found: ${productId}` });

            // CRITICAL FIX: Force full Mongoose documents (not lean!)
            const batches = await Stock.find({ productId }).sort({ expiryDate: 1 });

            const totalAvailable = batches.reduce((sum, b) => sum + b.quantity, 0);
            if (totalAvailable < qtyToSell) {
                return res.status(400).json({
                    error: `Insufficient stock for ${product.name}`,
                    available: totalAvailable,
                    requested: qtyToSell
                });
            }

            let remaining = qtyToSell;
            const batchRefs = [];

            for (const batch of batches) {
                if (remaining <= 0) break;

                const take = Math.min(batch.quantity, remaining);

                batch.quantity -= take;
                await batch.save();  // NOW 100% WORKS!

                batchRefs.push({
                    batchId: batch._id,
                    quantityTaken: take
                });

                remaining -= take;
            }

            const itemTotal = qtyToSell * salePrice;
            grandTotal += itemTotal;

            invoiceItems.push({
                productId,
                productName: product.name,
                quantity: qtyToSell,
                salePrice,
                total: itemTotal,
                batchRefs
            });
        }

        const invoice = await CustomerBill.create({
            _id: invoiceId,
            customerId,
            customerName: customer.name,
            date: new Date(),
            items: invoiceItems,
            grandTotal,
            paymentStatus,
            notes: notes || ""
        });

        // POPULATE NOW WORKS BECAUSE OF THE FIXED MODEL!
        let populatedInvoice = invoice;
        try {
            populatedInvoice = await CustomerBill.findById(invoiceId)
                .populate('customerId', 'name phone address contactPerson')
                .populate('items.productId', 'name barcode category');
        } catch (popErr) {
            console.warn("Populate failed, returning raw invoice");
        }

        res.status(201).json({
            message: "Sale completed – stock updated successfully (FIFO)",
            invoiceId,
            grandTotal,
            invoice: populatedInvoice
        });

    } catch (err) {
        console.error("SELL API Error:", err);
        res.status(500).json({ error: "Failed to process sale", details: err.message });
    }
});
//===================================================================================
// ===============================
// RETURN / REFUND API
// ===============================
// ===============================
// FULL RETURN / REFUND API
// ===============================
// ===============================
// FULL RETURN / REFUND API
// ===============================

//=====// ===============================
// CLEAN & FIXED RETURN / REFUND API
// ===============================
// ===============================
// FINAL FIXED RETURN / REFUND API
// ===============================
app.post('/api/returns', verifyToken, async (req, res) => {
    try {
        const {
            type,             // "customer" or "supplier"
            customerId,
            supplierId,
            items,
            relatedInvoiceId,
            relatedBillId,
            refundAmount,
            notes
        } = req.body;

        // 1. Basic Validation
        if (!type || !["customer", "supplier"].includes(type)) {
            return res.status(400).json({ error: "type must be 'customer' or 'supplier'" });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "items[] required" });
        }

        if (type === "customer") {
            if (!customerId) return res.status(400).json({ error: "customerId required" });
            if (!relatedInvoiceId) return res.status(400).json({ error: "relatedInvoiceId required" });
        }

        if (type === "supplier") {
            if (!supplierId) return res.status(400).json({ error: "supplierId required" });
        }

        // 2. Item Quantity Validation
        for (let it of items) {
            if (!it.productId || !it.quantity) {
                return res.status(400).json({ error: "Each item requires productId and quantity" });
            }
            if (Number(it.quantity) <= 0) {
                return res.status(400).json({ error: "Quantity must be > 0" });
            }
        }

        const returnId = "ret_" + Date.now();
        const processedItems = [];

        // ===============================
        // A. CUSTOMER RETURN LOGIC
        // Restore stock based on original Invoice BatchRefs
        // ===============================
        let invoice = null;

        if (type === "customer") {
            invoice = await CustomerBill.findById(relatedInvoiceId);
            if (!invoice) return res.status(404).json({ error: "Invoice not found" });
        }

        for (let it of items) {
            const { productId, quantity: returnQty, reason } = it;
            
            // Convert to number to avoid type issues
            let qtyLeft = Number(returnQty);
            let batchRefs = [];

            // --- Customer Return ---
            if (type === "customer") {
                const invItem = invoice.items.find(i => i.productId === productId);
                
                if (!invItem) {
                    return res.status(400).json({
                        error: `Product ${productId} not found in invoice ${relatedInvoiceId}`
                    });
                }

                if (qtyLeft > invItem.quantity) {
                    return res.status(400).json({
                        error: `Cannot return ${qtyLeft}. Only ${invItem.quantity} was purchased.`
                    });
                }

                // Loop through the batches used in the original sale
                // invItem.batchRefs can be ["id", "id"] OR [{ batchId, quantityTaken }]
                if (invItem.batchRefs && invItem.batchRefs.length > 0) {
                    for (let ref of invItem.batchRefs) {
                        if (qtyLeft <= 0) break;

                        // -------------------------------------------------------
                        // FIX 1: Handle "Old Format" (Array of Strings)
                        // Logic: Each string represents 1 unit.
                        // -------------------------------------------------------
                        if (typeof ref === "string") {
                            const batch = await Stock.findById(ref);
                            if (batch) {
                                const addQty = 1; // Restoring 1 unit per ID entry
                                batch.quantity = Number(batch.quantity) + addQty;
                                await batch.save();

                                batchRefs.push({ batchId: ref, quantity: addQty });
                                qtyLeft -= addQty;
                            }
                            continue;
                        }

                        // -------------------------------------------------------
                        // FIX 2: Handle "New Format" (Array of Objects)
                        // Logic: Check 'quantityTaken' (from sale) or fallback to 'quantity'
                        // -------------------------------------------------------
                        if (ref.batchId) {
                            // The sale API saves it as 'quantityTaken', but some old data might have 'quantity'
                            const soldFromBatch = Number(ref.quantityTaken || ref.quantity || 0);
                            
                            // We can only return what was taken from this specific batch, 
                            // or whatever is left of the return request.
                            const addQty = Math.min(soldFromBatch, qtyLeft);

                            if (addQty > 0) {
                                const batch = await Stock.findById(ref.batchId);
                                if (batch) {
                                    batch.quantity = Number(batch.quantity) + Number(addQty);
                                    await batch.save();

                                    batchRefs.push({ batchId: ref.batchId, quantity: addQty });
                                }
                                qtyLeft -= addQty;
                            }
                        }
                    }
                } else {
                    // Fallback if no batchRefs exist (Legacy Data): Just add to any batch or log error
                    // For now, we will skip stock update to prevent crashing, but you could add logic here
                    console.warn(`No batch refs found for product ${productId} in invoice.`);
                }

                // Check if we managed to return everything
                if (qtyLeft > 0) {
                    console.warn(`Could not fully restore stock for ${productId}. Unmatched qty: ${qtyLeft}`);
                    // We proceed anyway, but the stock won't be 100% accurate for the remainder
                }
            }

            // ===============================
            // B. SUPPLIER RETURN LOGIC
            // Remove from stock (FIFO or specific logic)
            // ===============================
            if (type === "supplier") {
                // Get batches for this product, sorted by expiry (FIFO removal)
                const batches = await Stock.find({ productId }).sort({ expiryDate: 1 });

                const totalAvailable = batches.reduce((s, b) => s + b.quantity, 0);
                if (totalAvailable < qtyLeft) {
                    return res.status(400).json({
                        error: `Not enough stock to return to supplier. Available: ${totalAvailable}, Required: ${qtyLeft}`
                    });
                }

                for (let batch of batches) {
                    if (qtyLeft <= 0) break;

                    const take = Math.min(batch.quantity, qtyLeft);
                    batch.quantity = Number(batch.quantity) - Number(take);
                    await batch.save();

                    batchRefs.push({ batchId: batch._id, quantity: take });

                    qtyLeft -= take;
                }
            }

            // Add to the processed items list for the Return Document
            processedItems.push({
                productId,
                quantity: Number(returnQty), // Original requested quantity
                reason: reason || "",
                batchRefs
            });
        }

        // ===============================
        // 3. Create & Save Return Document
        // ===============================
        const newReturn = await ReturnModel.create({
            _id: returnId,
            type,
            date: new Date(),
            customerId: type === "customer" ? customerId : null,
            supplierId: type === "supplier" ? supplierId : null,
            items: processedItems,
            relatedInvoiceId: relatedInvoiceId || null,
            relatedBillId: relatedBillId || null,
            refundAmount: Number(refundAmount) || 0,
            notes: notes || "",
            createdAt: new Date() // Explicit timestamp
        });

        res.status(201).json({
            message: "Return processed successfully",
            return: newReturn
        });

    } catch (err) {
        console.error("Return API Error:", err);
        res.status(500).json({ 
            error: "Server error in return API", 
            details: err.message 
        });
    }
});
//==============================================================================

app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close();
    mongoose.connection.close();
    process.exit(0);
});