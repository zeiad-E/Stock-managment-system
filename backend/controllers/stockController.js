const { Stock, Product, Supplier } = require('../models/InventoryModels');

exports.listBatches = async (req, res) => {
    const batches = await Stock.find().sort({ expiryDate: 1 });
    res.json(batches);
};

exports.getLowStock = async (req, res) => {
    const threshold = Number(req.query.threshold) || 20;
    const products = await Product.find();
    
    const alerts = [];
    for(let p of products) {
        const batches = await Stock.find({ productId: p._id });
        const total = batches.reduce((sum, b) => sum + b.quantity, 0);
        if(total <= threshold) alerts.push({ productId: p._id, name: p.name, stock: total });
    }
    res.json(alerts);
};

exports.getExpiring = async (req, res) => {
    const days = Number(req.query.days) || 30;
    const limit = new Date();
    limit.setDate(limit.getDate() + days);

    const batches = await Stock.find({ expiryDate: { $lte: limit, $gte: new Date() } }).populate('productId', 'name');
    res.json(batches);
};

exports.createBatch = async (req, res) => {
    try {
        const { _id, batchNumber, productId, quantity, expiryDate, supplierId, unitPrice, notes } = req.body;

        if (!productId || !quantity || !expiryDate || (!batchNumber && !_id)) {
            return res.status(400).json({
                error: "productId, quantity, expiryDate and batchNumber are required"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: `Product ${productId} not found` });
        }

        if (supplierId) {
            const supplier = await Supplier.findById(supplierId);
            if (!supplier) {
                return res.status(404).json({ error: `Supplier ${supplierId} not found` });
            }
        }

        const batchId = (_id || batchNumber).trim();
        if (!batchId) {
            return res.status(400).json({ error: "Batch identifier cannot be empty" });
        }

        const payload = {
            _id: batchId,
            productId,
            quantity: Number(quantity),
            expiryDate: new Date(expiryDate),
            supplierId: supplierId || undefined,
            unitPrice: unitPrice ? Number(unitPrice) : undefined,
            notes: notes || undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const createdBatch = await Stock.create(payload);

        res.status(201).json({
            message: "Stock batch created successfully",
            batch: createdBatch
        });
    } catch (err) {
        console.error("Error creating stock batch:", err);
        res.status(500).json({
            error: "Failed to create batch",
            details: err.message
        });
    }
};