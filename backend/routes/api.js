const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Controllers
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const customerController = require('../controllers/customerController');
const supplierController = require('../controllers/supplierController');
const stockController = require('../controllers/stockController');
const transController = require('../controllers/transactionController');
const returnController = require('../controllers/returnController');

// --- Auth ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- Products ---
router.post('/products/create', verifyToken, productController.createProduct);
router.get('/products/list', verifyToken, productController.listProducts);
router.get('/products/search', verifyToken, productController.searchProducts);
router.get('/products/:id', verifyToken, productController.getProduct);
router.delete('/products/delete/:id', verifyToken, productController.deleteProduct);

// --- Customers ---
router.post('/customers/create', verifyToken, customerController.createCustomer);
router.get('/customers/list', verifyToken, customerController.listCustomers);
router.get('/customers/search', verifyToken, customerController.searchCustomers);
router.delete('/customers/delete/:id', verifyToken, customerController.deleteCustomer);
// --- Suppliers ---
router.post('/suppliers/create', verifyToken, supplierController.createSupplier);
router.get('/suppliers/list', verifyToken, supplierController.listSuppliers);
router.delete('/suppliers/delete/:id', verifyToken, supplierController.deleteSupplier); // Add this line

// --- Stock ---
router.get('/stock/batches/list', verifyToken, stockController.listBatches);
router.post('/stock/batches/create', verifyToken, stockController.createBatch);
router.get('/stock/alerts/low-stock', verifyToken, stockController.getLowStock);
router.get('/stock/alerts/expiring-soon', verifyToken, stockController.getExpiring);

// --- Transactions (Sell) ---
router.post('/customer-bills/sell', verifyToken, transController.createSale);
// NEW: Supplier Bill Route
router.post('/supplier-bills/buy', verifyToken, transController.createPurchase);

// --- Returns (The Fixed API) ---
router.post('/returns', verifyToken, returnController.createReturn);


// NEW: Bill Lists (History)
router.get('/customer-bills/list', verifyToken, transController.getCustomerBills);
router.get('/supplier-bills/list', verifyToken, transController.getSupplierBills);


module.exports = router;