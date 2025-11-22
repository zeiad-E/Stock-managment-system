const { Customer } = require('../models/InventoryModels');

exports.createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json({ message: "Created", customer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchCustomers = async (req, res) => {
    try {
        const { q } = req.query;
        const customers = await Customer.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { phone: { $regex: q } }
            ]
        });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// backend/controllers/customerController.js
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        
        res.json({ message: "Customer deleted successfully", deletedCustomer });
    } catch (err) {
        console.error('Delete customer error:', err);
        res.status(500).json({ 
            message: "Error deleting customer",
            error: err.message 
        });
    }
};