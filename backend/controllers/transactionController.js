const { 
    CustomerBill, 
    SupplierBill, 
    Stock, 
    Product, 
    Customer, 
    Supplier 
} = require('../models/InventoryModels');

// ===============================
// Customer Bill (Sale) – with FIFO & stock-0 auto delete
// ===============================
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

            // Stock Check (FIFO by expiry)
            const batches = await Stock.find({ productId }).sort({ expiryDate: 1 });
            const totalAvailable = batches.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
            
            if (totalAvailable < qtyToSell) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }

            // Deduct Logic (FIFO)
            let remaining = qtyToSell;
            const batchRefs = [];

            for (const batch of batches) {
                if (remaining <= 0) break;

                const take = Math.min(Number(batch.quantity), remaining);
                batch.quantity = Number(batch.quantity) - take;
                await batch.save();

                // 🔥 NEW: auto-delete batch if quantity hits 0
                if (batch.quantity <= 0) {
                    await Stock.deleteOne({ _id: batch._id });
                }

                batchRefs.push({ batchId: batch._id, quantityTaken: take });
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

        res.status(201).json({ 
            message: "Sale successful", 
            invoiceId, 
            grandTotal, 
            invoice 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ===============================
// Supplier Bill (Purchase) – stock IN (no delete here)
// ===============================
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

// 3. Profit Statistics (Total Revenue, Total Cost, Net Profit)
exports.getProfitStats = async (req, res) => {
    try {
        const [salesAgg] = await CustomerBill.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $ifNull: ["$grandTotal", 0] } },
                },
            },
        ]);

        const [purchaseAgg] = await SupplierBill.aggregate([
            {
                $group: {
                    _id: null,
                    totalCost: { $sum: { $ifNull: ["$grandTotal", 0] } },
                },
            },
        ]);

        const totalRevenue = salesAgg?.totalRevenue || 0;
        const totalCost = purchaseAgg?.totalCost || 0;
        const netProfit = totalRevenue - totalCost;

        res.json({ totalRevenue, totalCost, netProfit });
    } catch (err) {
        res.status(500).json({ error: "Failed to compute profit statistics", details: err.message });
    }
};

// 4. Monthly Profit Statistics (per month revenue, cost, net profit)
exports.getMonthlyProfitStats = async (req, res) => {
    try {
        const months = parseInt(req.query.months, 10) || 6;

        const salesAgg = await CustomerBill.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                    totalRevenue: { $sum: { $ifNull: ["$grandTotal", 0] } },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const purchasesAgg = await SupplierBill.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                    },
                    totalCost: { $sum: { $ifNull: ["$grandTotal", 0] } },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const byMonth = {};

        for (const entry of salesAgg) {
            const { year, month } = entry._id;
            const key = `${year}-${String(month).padStart(2, "0")}`;
            if (!byMonth[key]) {
                byMonth[key] = { year, month, totalRevenue: 0, totalCost: 0 };
            }
            byMonth[key].totalRevenue = entry.totalRevenue || 0;
        }

        for (const entry of purchasesAgg) {
            const { year, month } = entry._id;
            const key = `${year}-${String(month).padStart(2, "0")}`;
            if (!byMonth[key]) {
                byMonth[key] = { year, month, totalRevenue: 0, totalCost: 0 };
            }
            byMonth[key].totalCost = entry.totalCost || 0;
        }

        let result = Object.values(byMonth).sort((a, b) => {
            if (a.year === b.year) return a.month - b.month;
            return a.year - b.year;
        });

        if (months > 0 && result.length > months) {
            result = result.slice(result.length - months);
        }

        result = result.map((item) => ({
            year: item.year,
            month: item.month,
            totalRevenue: item.totalRevenue,
            totalCost: item.totalCost,
            netProfit: item.totalRevenue - item.totalCost,
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to compute monthly profit statistics", details: err.message });
    }
};