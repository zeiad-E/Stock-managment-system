const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  category: String,
  buyPrice: Number,
  sellPrice: Number,
  barcode: String,
  supplierId: { type: String, ref: "Supplier" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CustomerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  contactPerson: String,
  phone: String,
  address: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SupplierSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  contactPerson: String,
  phone: String,
  email: String,
  address: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const StockSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  productId: { type: String, ref: "Product", required: true },
  supplierId: { type: String, ref: "Supplier" },
  quantity: { type: Number, required: true },
  unitPrice: Number,
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CustomerBillSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  customerId: { type: String, ref: "Customer", required: true },
  date: { type: Date, default: Date.now },
  items: [{
    productId: { type: String, ref: "Product", required: true },
    quantity: Number,
    salePrice: Number,
    total: Number,
    batchRefs: [{
      batchId: { type: String, ref: "Stock" },
      quantityTaken: Number
    }]
  }],
  grandTotal: Number,
  paymentStatus: String,
  notes: String
});

const SupplierBillSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  supplierId: { type: String, ref: "Supplier", required: true },
  date: { type: Date, default: Date.now },
  items: [{
    productId: { type: String, ref: "Product" },
    batchId: { type: String, ref: "Stock" },
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  grandTotal: Number,
  paymentStatus: String,
  notes: String
});

const ReturnSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ["customer", "supplier"], required: true },
  customerId: { type: String, ref: "Customer" },
  supplierId: { type: String, ref: "Supplier" },
  date: { type: Date, default: Date.now },
  items: [{
    productId: { type: String, ref: "Product" },
    quantity: Number,
    reason: String,
    batchRefs: [{
      batchId: { type: String, ref: "Stock" },
      quantity: Number
    }]
  }],
  relatedInvoiceId: { type: String, ref: "CustomerBill" },
  relatedBillId: { type: String, ref: "SupplierBill" },
  refundAmount: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const ExpenseSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: String,
  amount: Number,
  date: Date,
  notes: String
});

module.exports = {
    Product: mongoose.model("Product", ProductSchema, "products"),
    Customer: mongoose.model("Customer", CustomerSchema, "customers"),
    Supplier: mongoose.model("Supplier", SupplierSchema, "suppliers"),
    Stock: mongoose.model("Stock", StockSchema, "stock"),
    CustomerBill: mongoose.model("CustomerBill", CustomerBillSchema, "customer_bills"),
    SupplierBill: mongoose.model("SupplierBill", SupplierBillSchema, "supplier_bills"),
    ReturnModel: mongoose.model("Return", ReturnSchema, "returns"),
    Expense: mongoose.model("Expense", ExpenseSchema, "expenses")
};