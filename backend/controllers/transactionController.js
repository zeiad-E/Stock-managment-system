const { CustomerBill, Stock, Product, Customer } = require('../models/InventoryModels');

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