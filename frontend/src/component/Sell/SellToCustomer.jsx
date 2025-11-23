import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './SellToCustomerStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';  // Assume this is unchanged

const SellToCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        customerId: '',
        paymentStatus: 'paid',
        notes: '',
        items: [{ productId: '', quantity: 0, salePrice: 0 }]
    });
    const token = localStorage.getItem('token');
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now

    useEffect(() => {
        fetchCustomers();
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
        if (e.target.name === 'productId') {
            const selectedProduct = products.find(p => p._id === e.target.value);
            if (selectedProduct) {
                newItems[index].salePrice = selectedProduct.sellPrice;
            }
        }
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: '', quantity: 0, salePrice: 0 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/customer-bills/sell', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Sale successful!');
            // Reset form or redirect
            setFormData({
                customerId: '',
                paymentStatus: 'paid',
                notes: '',
                items: [{ productId: '', quantity: 0, salePrice: 0 }]
            });
        } catch (err) {
            console.error(err);
            alert('Sale failed!');
        }
    };

    return (
        <div className={style.sellContainer}>
            <Header name="Sell to Customer"/>
            <div className={style.sellHeader}>
                <div>
                    <h1 className={style.sellTitle}>Sell to Customer</h1>
                    <p className={style.sellSubtitle}>Create a sale bill and update stock</p>
                </div>
            </div>

            <form className={style.sellForm} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label>Customer</label>
                    <select name="customerId" value={formData.customerId} onChange={handleChange} required>
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>

                <div className={style.formGroup}>
                    <label>Payment Status</label>
                    <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
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
                            <input type="number" name="salePrice" value={item.salePrice} onChange={(e) => handleItemChange(index, e)} placeholder="Sale Price" required />
                            <FontAwesomeIcon icon={faTrash} className={style.removeIcon} onClick={() => removeItem(index)} />
                        </div>
                    ))}
                    <button type="button" className={style.addItemBtn} onClick={addItem}>
                        <FontAwesomeIcon icon={faPlus} /> Add Item
                    </button>
                </div>

                <button type="submit" className={style.submitBtn}>Submit Sale</button>
            </form>
        </div>
    );
};

export default SellToCustomer;