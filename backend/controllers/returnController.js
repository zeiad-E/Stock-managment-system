const { ReturnModel, CustomerBill, Stock } = require('../models/InventoryModels');

exports.createReturn = async (req, res) => {
    try {
        const {
            type, customerId, supplierId, items, relatedInvoiceId, relatedBillId, refundAmount, notes
        } = req.body;

        // 1. Basic Validation
        if (!type || !["customer", "supplier"].includes(type)) return res.status(400).json({ error: "Invalid type" });
        if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "items[] required" });

        if (type === "customer") {
            if (!customerId || !relatedInvoiceId) return res.status(400).json({ error: "Customer return requires customerId and relatedInvoiceId" });
        }
        if (type === "supplier" && !supplierId) return res.status(400).json({ error: "Supplier return requires supplierId" });

        const returnId = "ret_" + Date.now();
        const processedItems = [];

        // Logic Setup
        let invoice = null;
        if (type === "customer") {
            invoice = await CustomerBill.findById(relatedInvoiceId);
            if (!invoice) return res.status(404).json({ error: "Invoice not found" });
        }

        // Process Items
        for (let it of items) {
            const { productId, quantity, reason } = it;
            if (!productId || Number(quantity) <= 0) return res.status(400).json({ error: "Invalid item details" });

            let qtyLeft = Number(quantity);
            let batchRefs = [];

            // A. Customer Return (Restore Stock)
            if (type === "customer") {
                const invItem = invoice.items.find(i => i.productId === productId);
                if (!invItem) return res.status(400).json({ error: `Product ${productId} not in invoice` });

                if (invItem.batchRefs) {
                    for (let ref of invItem.batchRefs) {
                        if (qtyLeft <= 0) break;

                        // FIX: Old Format (Strings)
                        if (typeof ref === "string") {
                            const batch = await Stock.findById(ref);
                            if (batch) {
                                batch.quantity = Number(batch.quantity) + 1;
                                await batch.save();
                                batchRefs.push({ batchId: ref, quantity: 1 });
                                qtyLeft -= 1;
                            }
                        } 
                        // FIX: New Format (Objects)
                        else if (ref.batchId) {
                            const soldFromBatch = Number(ref.quantityTaken || ref.quantity || 0);
                            const addQty = Math.min(soldFromBatch, qtyLeft);
                            if (addQty > 0) {
                                const batch = await Stock.findById(ref.batchId);
                                if (batch) {
                                    batch.quantity = Number(batch.quantity) + Number(addQty);
                                    await batch.save();
                                    batchRefs.push({ batchId: ref.batchId, quantity: addQty });
                                }
                                qtyLeft -= addQty;
                            }
                        }
                    }
                }
            }

            // B. Supplier Return (Remove Stock)
            if (type === "supplier") {
                const batches = await Stock.find({ productId }).sort({ expiryDate: 1 });
                for (let batch of batches) {
                    if (qtyLeft <= 0) break;
                    const take = Math.min(batch.quantity, qtyLeft);
                    batch.quantity = Number(batch.quantity) - Number(take);
                    await batch.save();
                    batchRefs.push({ batchId: batch._id, quantity: take });
                    qtyLeft -= take;
                }
            }

            processedItems.push({ productId, quantity: Number(quantity), reason, batchRefs });
        }

        const newReturn = await ReturnModel.create({
            _id: returnId, type, date: new Date(),
            customerId: type === "customer" ? customerId : null,
            supplierId: type === "supplier" ? supplierId : null,
            items: processedItems, relatedInvoiceId, relatedBillId,
            refundAmount: Number(refundAmount), notes
        });

        res.status(201).json({ message: "Return processed", return: newReturn });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};