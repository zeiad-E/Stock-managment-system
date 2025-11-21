const { Stock, Product } = require('../models/InventoryModels');

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