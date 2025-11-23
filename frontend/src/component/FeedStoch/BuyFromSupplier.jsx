import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './BuyFromSupplierStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';  // Assume this is unchanged

const BuyFromSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        supplierId: '',
        paymentStatus: 'paid',
        notes: '',
        items: [{ productId: '', quantity: 0, unitPrice: 0, expiryDate: '' }]
    });
const token = localStorage.getItem('token');
    useEffect(() => {
        fetchSuppliers();
        fetchProducts();
    }, []);

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
        if (e.target.name === 'productId') {
            const selectedProduct = products.find(p => p._id === e.target.value);
            if (selectedProduct) {
                newItems[index].unitPrice = selectedProduct.buyPrice;
            }
        }
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: '', quantity: 0, unitPrice: 0, expiryDate: '' }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/supplier-bills/buy', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Purchase successful!');
            // Reset form or redirect
            setFormData({
                supplierId: '',
                paymentStatus: 'paid',
                notes: '',
                items: [{ productId: '', quantity: 0, unitPrice: 0, expiryDate: '' }]
            });
        } catch (err) {
            console.error(err);
            alert('Purchase failed!');
        }
    };

    return (
        <div className={style.buyContainer}>
            <Header name="Buy from Supplier"/>
            <div className={style.buyHeader}>
                <div>
                    <h1 className={style.buyTitle}>Buy from Supplier</h1>
                    <p className={style.buySubtitle}>Create a purchase bill and update stock</p>
                </div>
            </div>

            <form className={style.buyForm} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label>Supplier</label>
                    <select name="supplierId" value={formData.supplierId} onChange={handleChange} required>
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
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
                            <input type="number" name="unitPrice" value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} placeholder="Unit Price" required />
                            <input type="date" name="expiryDate" value={item.expiryDate} onChange={(e) => handleItemChange(index, e)} required />
                            <FontAwesomeIcon icon={faTrash} className={style.removeIcon} onClick={() => removeItem(index)} />
                        </div>
                    ))}
                    <button type="button" className={style.addItemBtn} onClick={addItem}>
                        <FontAwesomeIcon icon={faPlus} /> Add Item
                    </button>
                </div>

                <button type="submit" className={style.submitBtn}>Submit Purchase</button>
            </form>
        </div>
    );
};

export default BuyFromSupplier;