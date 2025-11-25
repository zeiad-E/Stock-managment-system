import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import style from './SellToCustomerStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';
import { useLanguage } from '../../context/LanguageContext';

const copyMap = {
    en: {
        headerName: 'Sell to Customer',
        pageTitle: 'Sell to Customer',
        subtitle: 'Create a sale bill and update stock',
        customerLabel: 'Customer',
        customerPlaceholder: 'Select Customer',
        paymentStatus: 'Payment Status',
        paid: 'Paid',
        unpaid: 'Unpaid',
        notes: 'Notes',
        itemsTitle: 'Items',
        selectProduct: 'Select Product',
        quantityPlaceholder: 'Quantity',
        salePricePlaceholder: 'Sale Price',
        addItem: 'Add Item',
        submit: 'Submit Sale',
        success: 'Sale successful!',
        failure: 'Sale failed!',
    },
    ar: {
        headerName: 'البيع للعميل',
        pageTitle: 'البيع للعميل',
        subtitle: 'أنشئ فاتورة بيع وحدّث المخزون',
        customerLabel: 'العميل',
        customerPlaceholder: 'اختر العميل',
        paymentStatus: 'حالة الدفع',
        paid: 'مدفوع',
        unpaid: 'غير مدفوع',
        notes: 'الملاحظات',
        itemsTitle: 'العناصر',
        selectProduct: 'اختر المنتج',
        quantityPlaceholder: 'الكمية',
        salePricePlaceholder: 'سعر البيع',
        addItem: 'إضافة عنصر',
        submit: 'تأكيد البيع',
        success: 'تمت عملية البيع بنجاح!',
        failure: 'فشلت عملية البيع!',
    },
};

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
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
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
            alert(copy.success);
            // Reset form or redirect
            setFormData({
                customerId: '',
                paymentStatus: 'paid',
                notes: '',
                items: [{ productId: '', quantity: 0, salePrice: 0 }]
            });
        } catch (err) {
            console.error(err);
            alert(copy.failure);
        }
    };

    return (
        <div className={style.sellContainer}>
            <Header name={copy.headerName}/>
            <div className={style.sellHeader}>
                <div>
                    <h1 className={style.sellTitle}>{copy.pageTitle}</h1>
                    <p className={style.sellSubtitle}>{copy.subtitle}</p>
                </div>
            </div>

            <form className={style.sellForm} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label>{copy.customerLabel}</label>
                    <select name="customerId" value={formData.customerId} onChange={handleChange} required>
                        <option value="">{copy.customerPlaceholder}</option>
                        {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>

                <div className={style.formGroup}>
                    <label>{copy.paymentStatus}</label>
                    <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                        <option value="paid">{copy.paid}</option>
                        <option value="unpaid">{copy.unpaid}</option>
                    </select>
                </div>

                <div className={style.formGroup}>
                    <label>{copy.notes}</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
                </div>

                <div className={style.itemsSection}>
                    <h3>{copy.itemsTitle}</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className={style.itemRow}>
                            <select name="productId" value={item.productId} onChange={(e) => handleItemChange(index, e)} required>
                                <option value="">{copy.selectProduct}</option>
                                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder={copy.quantityPlaceholder} required />
                            <input type="number" name="salePrice" value={item.salePrice} onChange={(e) => handleItemChange(index, e)} placeholder={copy.salePricePlaceholder} required />
                            <FontAwesomeIcon icon={faTrash} className={style.removeIcon} onClick={() => removeItem(index)} />
                        </div>
                    ))}
                    <button type="button" className={style.addItemBtn} onClick={addItem}>
                        <FontAwesomeIcon icon={faPlus} /> {copy.addItem}
                    </button>
                </div>

                <button type="submit" className={style.submitBtn}>{copy.submit}</button>
            </form>
        </div>
    );
};

export default SellToCustomer;