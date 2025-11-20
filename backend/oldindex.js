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
function createModel(modelName, collectionName) {
    return mongoose.model(
        modelName,
        new mongoose.Schema(
            {
                _id: { type: String, required: true }
            },
            {
                strict: false,
                collection: collectionName
            }
        ),
        collectionName
    );
}

const Customer = createModel('Customer', 'customers');
const CustomerBill = createModel('CustomerBill', 'customer_bills');
const Expense = createModel('Expense', 'expenses');
const Product = createModel('Product', 'products');
const ReturnModel = createModel('Return', 'returns');
const Stock = createModel('Stock', 'stock');
const Supplier = createModel('Supplier', 'suppliers');
const SupplierBill = createModel('SupplierBill', 'supplier_bills');


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


//Product API: 
//ADD: 
app.post('/api/products', verifyToken, async (req, res) => {
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
            buyPrice,
            sellPrice,
            barcode,
            supplierId,
            createdAt: now,
            updatedAt: now
        });

        res.json({ message: "Product added", product });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add product" });
    }
});

//Delete: 

app.delete('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Product.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ error: "Product not found" });

        res.json({ message: "Product deleted", deleted });

    } catch (err) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});

//Update: 
app.put('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        updates.updatedAt = new Date();

        const updated = await Product.findByIdAndUpdate(id, updates, {
            new: true
        });

        if (!updated) return res.status(404).json({ error: "Product not found" });

        res.json({ message: "Product updated", product: updated });

    } catch (err) {
        res.status(500).json({ error: "Failed to update product" });
    }
});
//***************Test pased************************* */
//Retrieve All Products with Sorting
app.get('/api/products/all', verifyToken, async (req, res) => {
    try {
        const { sortBy = "name", order = "asc" } = req.query;

        const sortOrder = order === "desc" ? -1 : 1;

        const products = await Product.find().sort({ [sortBy]: sortOrder });

        res.json(products);

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

//Filter: Updated Between Dates
app.get('/api/products/filter/date', verifyToken, async (req, res) => {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({ error: "from and to dates required" });
        }

        const products = await Product.find({
            updatedAt: {
                $gte: new Date(from),
                $lte: new Date(to)
            }
        });

        res.json(products);

    } catch (err) {
        res.status(500).json({ error: "Failed to filter products" });
    }
});

//Filter: Price Comparisons
app.get('/api/products/filter/price', verifyToken, async (req, res) => {
    try {
        const { type, min, max } = req.query;

        if (!type || (type !== "sellPrice" && type !== "buyPrice")) {
            return res.status(400).json({ error: "type must be sellPrice or buyPrice" });
        }

        const query = {};

        if (min) query[type] = { ...query[type], $gte: Number(min) };
        if (max) query[type] = { ...query[type], $lte: Number(max) };

        if (!min && !max) {
            return res.status(400).json({ error: "Provide min, max or both" });
        }

        const products = await Product.find(query);

        res.json(products);

    } catch (err) {
        res.status(500).json({ error: "Failed to filter products by price" });
    }
});

//Extra Filter: Category: 
app.get('/api/products/filter/category', verifyToken, async (req, res) => {
    try {
        const { cat } = req.query;
        if (!cat) return res.status(400).json({ error: "category name is required" });

        const products = await Product.find({ category: cat });

        res.json(products);

    } catch (err) {
        res.status(500).json({ error: "Failed to filter by category" });
    }
});

//Extra Filter Supplier: 
app.get('/api/products/filter/supplier', verifyToken, async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: "supplier id required" });

        const products = await Product.find({ supplierId: id });

        res.json(products);

    } catch (err) {
        res.status(500).json({ error: "Failed to filter by supplier" });
    }
});

//===================================================================================
// Supplier APIs


//Supplier: 
//Add Supplier: 
app.post('/api/suppliers', verifyToken, async (req, res) => {
    try {
        const { _id, name, contactPerson, phone, email, address, notes } = req.body;

        if (!_id || !name) {
            return res.status(400).json({ error: "_id and name are required" });
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

        res.json({ message: "Supplier added", supplier });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add supplier" });
    }
});

//Update Supplier: 
app.put('/api/suppliers/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        const updates = req.body;
        updates.updatedAt = new Date();

        const supplier = await Supplier.findByIdAndUpdate(id, updates, { new: true });

        if (!supplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        res.json({ message: "Supplier updated", supplier });

    } catch (err) {
        res.status(500).json({ error: "Failed to update supplier" });
    }
});

//Delete Supplier: 
app.delete('/api/suppliers/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Supplier.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        res.json({ message: "Supplier deleted", deleted });

    } catch (err) {
        res.status(500).json({ error: "Failed to delete supplier" });
    }
});

//Retrieve All Suppliers (with sort): 
app.get('/api/suppliers/all', verifyToken, async (req, res) => {
    try {
        const { sortBy = "name", order = "asc" } = req.query;

        const sortOrder = order === "desc" ? -1 : 1;

        const suppliers = await Supplier.find().sort({ [sortBy]: sortOrder });

        res.json(suppliers);

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
});

//Filter: By City (address): 
app.get('/api/suppliers/filter/city', verifyToken, async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) return res.status(400).json({ error: "City is required" });

        const suppliers = await Supplier.find({ address: city });

        res.json(suppliers);

    } catch (err) {
        res.status(500).json({ error: "Failed to filter suppliers" });
    }
});
//===================================================================================


app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close();
    mongoose.connection.close();
    process.exit(0);
});