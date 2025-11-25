import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import style from './ReturnsStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';
import { useLanguage } from '../../context/LanguageContext';

const copyMap = {
    en: {
        headerName: 'Returns & Refunds',
        pageTitle: 'Process Returns',
        subtitle: 'Handle customer or supplier returns and update stock',
        typeLabel: 'Type',
        typeCustomer: 'Customer Return',
        typeSupplier: 'Supplier Return',
        customerLabel: 'Customer',
        customerPlaceholder: 'Select Customer',
        supplierLabel: 'Supplier',
        supplierPlaceholder: 'Select Supplier',
        invoiceLabel: 'Related Invoice ID',
        refundLabel: 'Refund Amount',
        notesLabel: 'Notes',
        itemsTitle: 'Items',
        productPlaceholder: 'Select Product',
        quantityPlaceholder: 'Quantity',
        reasonPlaceholder: 'Reason',
        addItem: 'Add Item',
        submit: 'Process Return',
        success: 'Return processed successfully!',
        failure: 'Return processing failed!',
    },
    ar: {
        headerName: 'المرتجعات والمبالغ المستردة',
        pageTitle: 'معالجة المرتجعات',
        subtitle: 'تولَّ مرتجعات العملاء أو الموردين وحدّث المخزون',
        typeLabel: 'النوع',
        typeCustomer: 'مرتجع عميل',
        typeSupplier: 'مرتجع مورد',
        customerLabel: 'العميل',
        customerPlaceholder: 'اختر العميل',
        supplierLabel: 'المورد',
        supplierPlaceholder: 'اختر المورد',
        invoiceLabel: 'رقم الفاتورة المرتبط',
        refundLabel: 'مبلغ الاسترداد',
        notesLabel: 'الملاحظات',
        itemsTitle: 'العناصر',
        productPlaceholder: 'اختر المنتج',
        quantityPlaceholder: 'الكمية',
        reasonPlaceholder: 'السبب',
        addItem: 'إضافة عنصر',
        submit: 'معالجة المرتجع',
        success: 'تمت معالجة المرتجع بنجاح!',
        failure: 'فشلت معالجة المرتجع!',
    },
};

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
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
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
            alert(copy.success);
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
            alert(copy.failure);
        }
    };

    return (
        <div className={style.returnsContainer}>
            <Header name={copy.headerName}/>
            <div className={style.returnsHeader}>
                <div>
                    <h1 className={style.returnsTitle}>{copy.pageTitle}</h1>
                    <p className={style.returnsSubtitle}>{copy.subtitle}</p>
                </div>
            </div>

            <form className={style.returnsForm} onSubmit={handleSubmit}>
                <div className={style.formGroup}>
                    <label>{copy.typeLabel}</label>
                    <select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="customer">{copy.typeCustomer}</option>
                        <option value="supplier">{copy.typeSupplier}</option>
                    </select>
                </div>

                {formData.type === 'customer' ? (
                    <>
                        <div className={style.formGroup}>
                            <label>{copy.customerLabel}</label>
                            <select name="customerId" value={formData.customerId} onChange={handleChange} required>
                                <option value="">{copy.customerPlaceholder}</option>
                                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className={style.formGroup}>
                            <label>{copy.invoiceLabel}</label>
                            <input type="text" name="relatedInvoiceId" value={formData.relatedInvoiceId} onChange={handleChange} required />
                        </div>
                    </>
                ) : (
                    <div className={style.formGroup}>
                        <label>{copy.supplierLabel}</label>
                        <select name="supplierId" value={formData.supplierId} onChange={handleChange} required>
                            <option value="">{copy.supplierPlaceholder}</option>
                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                )}

                <div className={style.formGroup}>
                    <label>{copy.refundLabel}</label>
                    <input type="number" name="refundAmount" value={formData.refundAmount} onChange={handleChange} required />
                </div>

                <div className={style.formGroup}>
                    <label>{copy.notesLabel}</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
                </div>

                <div className={style.itemsSection}>
                    <h3>{copy.itemsTitle}</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className={style.itemRow}>
                            <select name="productId" value={item.productId} onChange={(e) => handleItemChange(index, e)} required>
                                <option value="">{copy.productPlaceholder}</option>
                                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder={copy.quantityPlaceholder} required />
                            <input type="text" name="reason" value={item.reason} onChange={(e) => handleItemChange(index, e)} placeholder={copy.reasonPlaceholder} required />
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

export default Returns;