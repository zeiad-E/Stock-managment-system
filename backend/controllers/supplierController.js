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

exports.deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        
        if (!deletedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        
        res.json({ message: "Supplier deleted successfully", deletedSupplier });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};