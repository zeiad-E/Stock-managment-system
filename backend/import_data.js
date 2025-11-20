
// ================= import_data.js =================
// This script reads your NDJSON files (data/*.ndjson), converts the string IDs
// to ObjectId, fixes references, inserts into MongoDB, and saves an id mapping
// file at data/id_mapping.json so you can correlate old IDs with new ObjectIds.

/*
Place your NDJSON files in a folder named `data` at the project root with these names:
- data/customer.ndjson
- data/supplier.ndjson
- data/products.ndjson
- data/stock.ndjson
- data/supplier_bills.ndjson
- data/customer_bills.ndjson
- data/expenses.ndjson
- data/return.ndjson

Run: node import_data.js
*/

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Re-use mongoose models by requiring the server file OR connect separately here
// For simplicity we will require mongoose here and models above are accessible
// if you run this file from the same process. If you run separately, you'll need
// to import models. To make the script independent, we'll create a minimal
// connection and model definitions (matching server.js) here.

(async function importAll() {
    // Connect
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Importer: connected to MongoDB');

    // Utility functions
    const dataDir = path.join(__dirname, 'data');
    const idMap = {}; // originalId(string) => ObjectId

    function parseLine(line) {
        if (!line.trim()) return null;
        try {
            return JSON.parse(line);
        } catch (e) {
            console.error('Failed to parse line:', line);
            throw e;
        }
    }

    function convertDates(obj) {
        if (obj && typeof obj === 'object') {
            if ('$date' in obj) return new Date(obj['$date']);
            for (const k of Object.keys(obj)) {
                obj[k] = convertDates(obj[k]);
            }
        }
        return obj;
    }

    // Read and insert a collection file and map its _id
    async function insertCollection(filename, Model, transformFn) {
        const file = path.join(dataDir, filename);
        if (!fs.existsSync(file)) {
            console.warn('File not found, skipping:', file);
            return;
        }
        const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
        for await (const line of rl) {
            const raw = parseLine(line);
            if (!raw) continue;
            // convert $date and nested dates
            const doc = JSON.parse(JSON.stringify(raw));
            // normalize: convert $date to Date recursively
            function recurse(o) {
                if (o && typeof o === 'object') {
                    if ('$date' in o) return new Date(o['$date']);
                    for (const k in o) o[k] = recurse(o[k]);
                }
                return o;
            }
            const normalized = recurse(doc);
            const oldId = normalized._id;
            // create new ObjectId
            const newId = new Types.ObjectId();
            idMap[oldId] = newId.toHexString();
            normalized._id = newId;

            // allow custom transformations for references (productId, supplierId, etc.)
            if (typeof transformFn === 'function') await transformFn(normalized, idMap);

            // insert
            try {
                await Model.create(normalized);
                console.log('Inserted into', filename, 'oldId=', oldId, 'newId=', newId.toHexString());
            } catch (err) {
                console.error('Error inserting', filename, oldId, err.message);
            }
        }
    }

    // Insert order: suppliers, customers, products, stock, supplier_bills, customer_bills, expenses, returns

    // Suppliers
    await insertCollection('supplier.ndjson', Supplier, async (doc) => { /* nothing needed */ });

    // Customers
    await insertCollection('customer.ndjson', Customer, async (doc) => { /* nothing needed */ });

    // Products: replace supplierId
    await insertCollection('products.ndjson', Product, async (doc, map) => {
        if (doc.supplierId && map[doc.supplierId]) doc.supplierId = Types.ObjectId(map[doc.supplierId]);
    });

    // Stock batches: replace productId, supplierId
    await insertCollection('stock.ndjson', Stock, async (doc, map) => {
        if (doc.productId && map[doc.productId]) doc.productId = Types.ObjectId(map[doc.productId]);
        if (doc.supplierId && map[doc.supplierId]) doc.supplierId = Types.ObjectId(map[doc.supplierId]);
    });

    // Supplier bills: items' productId/batchId and supplierId
    await insertCollection('supplier_bills.ndjson', SupplierBill, async (doc, map) => {
        if (doc.supplierId && map[doc.supplierId]) doc.supplierId = Types.ObjectId(map[doc.supplierId]);
        if (Array.isArray(doc.items)) {
            doc.items = doc.items.map(item => {
                if (item.productId && map[item.productId]) item.productId = Types.ObjectId(map[item.productId]);
                if (item.batchId && map[item.batchId]) item.batchId = Types.ObjectId(map[item.batchId]);
                return item;
            });
        }
    });

    // Customer bills: items' productId and batchRefs, customerId
    await insertCollection('customer_bills.ndjson', CustomerBill, async (doc, map) => {
        if (doc.customerId && map[doc.customerId]) doc.customerId = Types.ObjectId(map[doc.customerId]);
        if (Array.isArray(doc.items)) {
            doc.items = doc.items.map(item => {
                if (item.productId && map[item.productId]) item.productId = Types.ObjectId(map[item.productId]);
                if (Array.isArray(item.batchRefs)) item.batchRefs = item.batchRefs.map(ref => map[ref] ? Types.ObjectId(map[ref]) : ref);
                return item;
            });
        }
    });

    // Expenses
    await insertCollection('expenses.ndjson', Expense, async (doc) => { /* nothing */ });

    // Returns
    await insertCollection('return.ndjson', ReturnModel, async (doc, map) => {
        if (doc.customerId && map[doc.customerId]) doc.customerId = Types.ObjectId(map[doc.customerId]);
        if (doc.supplierId && map[doc.supplierId]) doc.supplierId = Types.ObjectId(map[doc.supplierId]);
        if (Array.isArray(doc.items)) {
            doc.items = doc.items.map(item => {
                if (item.productId && map[item.productId]) item.productId = Types.ObjectId(map[item.productId]);
                if (item.batchId && map[item.batchId]) item.batchId = Types.ObjectId(map[item.batchId]);
                return item;
            });
        }
        if (doc.relatedInvoiceId && map[doc.relatedInvoiceId]) doc.relatedInvoiceId = Types.ObjectId(map[doc.relatedInvoiceId]);
        if (doc.relatedBillId && map[doc.relatedBillId]) doc.relatedBillId = Types.ObjectId(map[doc.relatedBillId]);
    });

    // Save id mapping
    const mappingPath = path.join(dataDir, 'id_mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(idMap, null, 2));
    console.log('ID mapping saved to', mappingPath);

    console.log('Import finished.');
    process.exit(0);
})();
