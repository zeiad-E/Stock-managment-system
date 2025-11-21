const { Supplier } = require('../models/InventoryModels');

exports.createSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json({ message: "Created", supplier });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listSuppliers = async (req, res) => {
    const suppliers = await Supplier.find();
    res.json(suppliers);
};