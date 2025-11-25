import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import style from './BuyFromSupplierStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';
import { useLanguage } from '../../context/LanguageContext';

const copyMap = {
    en: {
        headerName: 'Buy from Supplier',
        pageTitle: 'Buy from Supplier',
        subtitle: 'Create a purchase bill and update stock',
        supplierLabel: 'Supplier',
        supplierPlaceholder: 'Select Supplier',
        paymentStatus: 'Payment Status',
        paid: 'Paid',
        unpaid: 'Unpaid',
        notes: 'Notes',
        itemsTitle: 'Items',
        selectProduct: 'Select Product',
        quantityPlaceholder: 'Quantity',
        unitPricePlaceholder: 'Unit Price',
        expiryPlaceholder: 'Expiry Date',
        addItem: 'Add Item',
        submit: 'Submit Purchase',
        success: 'Purchase successful!',
        failure: 'Purchase failed!',
    },
    ar: {
        headerName: 'الشراء من المورد',
        pageTitle: 'الشراء من المورد',
        subtitle: 'أنشئ فاتورة شراء وحدّث المخزون',
        supplierLabel: 'المورد',
        supplierPlaceholder: 'اختر المورد',
        paymentStatus: 'حالة الدفع',
        paid: 'مدفوع',
        unpaid: 'غير مدفوع',
        notes: 'الملاحظات',
        itemsTitle: 'العناصر',
        selectProduct: 'اختر المنتج',
        quantityPlaceholder: 'الكمية',
        unitPricePlaceholder: 'سعر الوحدة',
        expiryPlaceholder: 'تاريخ الانتهاء',
        addItem: 'إضافة عنصر',
        submit: 'تأكيد الشراء',
        success: 'تمت عملية الشراء بنجاح!',
        failure: 'فشلت عملية الشراء!',
    },
};

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
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
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
            alert(copy.success);
            // Reset form or redirect
            setFormData({
                supplierId: '',
                paymentStatus: 'paid',
                notes: '',
                items: [{ productId: '', quantity: 0, unitPrice: 0, expiryDate: '' }]
            });
        } catch (err) {
            console.error(err);
            alert(copy.failure);
        }
    };

    return (
        <div className={style.buyContainer}>
            <Header name={copy.headerName}/>
            <div className={style.buyHeader}>
                <div>
                    <h1 className={style.buyTitle}>{copy.pageTitle}</h1>
                    <p className={style.buySubtitle}>{copy.subtitle}</p>
                </div>
            </div>

            <form className={style.buyForm} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label>{copy.supplierLabel}</label>
                    <select name="supplierId" value={formData.supplierId} onChange={handleChange} required>
                        <option value="">{copy.supplierPlaceholder}</option>
                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
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
                            <input type="number" name="unitPrice" value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} placeholder={copy.unitPricePlaceholder} required />
                            <input type="date" name="expiryDate" value={item.expiryDate} onChange={(e) => handleItemChange(index, e)} aria-label={copy.expiryPlaceholder} required />
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

export default BuyFromSupplier;