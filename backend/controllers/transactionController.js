const { 
    CustomerBill, 
    SupplierBill, 
    Stock, 
    Product, 
    Customer, 
    Supplier 
} = require('../models/InventoryModels');

// Customer Bill (Sale)
exports.createSale = async (req, res) => {
    try {
        const { customerId, items, notes, paymentStatus = "unpaid" } = req.body;

        if (!customerId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Invalid sale data" });
        }

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        const invoiceId = `inv_${Date.now()}`;
        let grandTotal = 0;
        const invoiceItems = [];

        for (const it of items) {
            const { productId, quantity: qtyToSell, salePrice } = it;
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ error: `Product ${productId} not found` });

            // Stock Check
            const batches = await Stock.find({ productId }).sort({ expiryDate: 1 });
            const totalAvailable = batches.reduce((sum, b) => sum + b.quantity, 0);
            
            if (totalAvailable < qtyToSell) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }

            // Deduct Logic
            let remaining = qtyToSell;
            const batchRefs = [];
            for (const batch of batches) {
                if (remaining <= 0) break;
                const take = Math.min(batch.quantity, remaining);
                batch.quantity -= take;
                await batch.save();
                batchRefs.push({ batchId: batch._id, quantityTaken: take });
                remaining -= take;
            }

            const itemTotal = qtyToSell * salePrice;
            grandTotal += itemTotal;
            invoiceItems.push({
                productId, productName: product.name, quantity: qtyToSell, salePrice, total: itemTotal, batchRefs
            });
        }

        const invoice = await CustomerBill.create({
            _id: invoiceId, customerId, customerName: customer.name, date: new Date(),
            items: invoiceItems, grandTotal, paymentStatus, notes: notes || ""
        });

        res.status(201).json({ message: "Sale successful", invoiceId, grandTotal, invoice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supplier Bill (Purchase)
exports.createPurchase = async (req, res) => {
    try {
        const { supplierId, items, notes, paymentStatus = "paid" } = req.body;

        if (!supplierId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "supplierId and items[] are required" });
        }

        const supplier = await Supplier.findById(supplierId);
        if (!supplier) return res.status(404).json({ error: "Supplier not found" });

        const billId = `bill_${Date.now()}`;
        let grandTotal = 0;
        const billItems = [];

        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            
            if (!it.productId || !it.quantity || !it.unitPrice || !it.expiryDate) {
                return res.status(400).json({ 
                    error: "Item missing fields. Required: productId, quantity, unitPrice, expiryDate" 
                });
            }

            const product = await Product.findById(it.productId);
            if (!product) return res.status(404).json({ error: `Product ${it.productId} not found` });

            // Create NEW Stock Batch
            const batchId = `b_${Date.now()}_${i}`; 
            
            await Stock.create({
                _id: batchId,
                productId: it.productId,
                supplierId: supplierId,
                quantity: Number(it.quantity),
                unitPrice: Number(it.unitPrice),
                expiryDate: new Date(it.expiryDate),
                createdAt: new Date()
            });

            const itemTotal = Number(it.quantity) * Number(it.unitPrice);
            grandTotal += itemTotal;

            billItems.push({
                productId: it.productId,
                productName: product.name,
                batchId: batchId,
                quantity: Number(it.quantity),
                unitPrice: Number(it.unitPrice),
                total: itemTotal
            });
        }

        const newBill = await SupplierBill.create({
            _id: billId,
            supplierId,
            date: new Date(),
            items: billItems,
            grandTotal,
            paymentStatus,
            notes: notes || ""
        });

        res.status(201).json({
            message: "Purchase successful - Stock updated",
            billId,
            grandTotal,
            bill: newBill
        });

    } catch (err) {
        console.error("Purchase Error:", err);
        res.status(500).json({ error: err.message });
    }
};



// 1. Get All Customer Bills (Sales History)
exports.getCustomerBills = async (req, res) => {
    try {
        const bills = await CustomerBill.find()
            .populate('customerId', 'name phone contactPerson') // Get customer details
            .populate('items.productId', 'name category barcode') // Get product details
            .sort({ date: -1 }); // Sort by newest first

        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch customer bills", details: err.message });
    }
};

// 2. Get All Supplier Bills (Purchase History)
exports.getSupplierBills = async (req, res) => {
    try {
        const bills = await SupplierBill.find()
            .populate('supplierId', 'name email contactPerson') // Get supplier details
            .populate('items.productId', 'name category barcode') // Get product details
            .sort({ date: -1 }); // Newest first

        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch supplier bills", details: err.message });
    }
};