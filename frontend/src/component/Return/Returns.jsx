import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './ReturnsStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';  // Assume this is unchanged

const Returns = () => {
    const [customers, setCustomers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        type: 'customer',
        customerId: '',
        supplierId: '',
        relatedInvoiceId: '',
        refundAmount: 0,
        notes: '',
        items: [{ productId: '', quantity: 0, reason: '' }]
    });
    const token = localStorage.getItem('token');
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now

    useEffect(() => {
        fetchCustomers();
        fetchSuppliers();
        fetchProducts();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/customers/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/suppliers/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSuppliers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/products/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const newItems = [...formData.items];
        newItems[index][e.target.name] = e.target.value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: '', quantity: 0, reason: '' }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/returns', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Return processed successfully!');
            // Reset form
            setFormData({
                type: 'customer',
                customerId: '',
                supplierId: '',
                relatedInvoiceId: '',
                refundAmount: 0,
                notes: '',
                items: [{ productId: '', quantity: 0, reason: '' }]
            });
        } catch (err) {
            console.error(err);
            alert('Return processing failed!');
        }
    };

    return (
        <div className={style.returnsContainer}>
            <Header name="Returns & Refunds"/>
            <div className={style.returnsHeader}>
                <div>
                    <h1 className={style.returnsTitle}>Process Returns</h1>
                    <p className={style.returnsSubtitle}>Handle customer or supplier returns and update stock</p>
                </div>
            </div>

            <form className={style.returnsForm} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="customer">Customer Return</option>
                        <option value="supplier">Supplier Return</option>
                    </select>
                </div>

                {formData.type === 'customer' ? (
                    <>
                        <div className={style.formGroup}>
                            <label>Customer</label>
                            <select name="customerId" value={formData.customerId} onChange={handleChange} required>
                                <option value="">Select Customer</option>
                                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className={style.formGroup}>
                            <label>Related Invoice ID</label>
                            <input type="text" name="relatedInvoiceId" value={formData.relatedInvoiceId} onChange={handleChange} required />
                        </div>
                    </>
                ) : (
                    <div className={style.formGroup}>
                        <label>Supplier</label>
                        <select name="supplierId" value={formData.supplierId} onChange={handleChange} required>
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                )}

                <div className={style.formGroup}>
                    <label>Refund Amount</label>
                    <input type="number" name="refundAmount" value={formData.refundAmount} onChange={handleChange} required />
                </div>

                <div className={style.formGroup}>
                    <label>Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
                </div>

                <div className={style.itemsSection}>
                    <h3>Items</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className={style.itemRow}>
                            <select name="productId" value={item.productId} onChange={(e) => handleItemChange(index, e)} required>
                                <option value="">Select Product</option>
                                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" required />
                            <input type="text" name="reason" value={item.reason} onChange={(e) => handleItemChange(index, e)} placeholder="Reason" required />
                            <FontAwesomeIcon icon={faTrash} className={style.removeIcon} onClick={() => removeItem(index)} />
                        </div>
                    ))}
                    <button type="button" className={style.addItemBtn} onClick={addItem}>
                        <FontAwesomeIcon icon={faPlus} /> Add Item
                    </button>
                </div>

                <button type="submit" className={style.submitBtn}>Process Return</button>
            </form>
        </div>
    );
};

export default Returns;