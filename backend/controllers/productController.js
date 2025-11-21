const { Product } = require('../models/InventoryModels');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: "Product created", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listProducts = async (req, res) => {
    try {
        const { sortBy = "name", order = "asc" } = req.query;
        const products = await Product.find().sort({ [sortBy]: order === "desc" ? -1 : 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Query required" });
        const products = await Product.find({ name: { $regex: q, $options: 'i' } });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Not Found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};