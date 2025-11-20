const Product = require('../models/mongo/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const { sortBy = "name", order = "asc" } = req.query;
        const sortOrder = order === "desc" ? -1 : 1;
        const products = await Product.find().sort({ [sortBy]: sortOrder });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: "Product created", product });
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};

