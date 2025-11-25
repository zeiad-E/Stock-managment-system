import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import style from './StockStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faPlus, faTrash, faEye, faSearch, faSort } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';
import { useLanguage } from '../../context/LanguageContext';

const copyMap = {
    en: {
        headerName: 'Stock',
        pageTitle: 'My Stock',
        subtitle: 'Manage and track all your stock batches in one place',
        addButton: 'Add New Batch',
        searchPlaceholder: 'Search stock...',
        tableHeaders: ['Product', 'Batch Number', 'Quantity', 'Expiry Date', 'Notes', 'Action'],
        prompts: {
            productId: 'Enter product ID (e.g., p101)',
            quantity: 'Enter quantity',
            expiryDate: 'Enter expiry date (YYYY-MM-DD)',
            batchNumber: 'Enter batch number',
            notes: 'Enter notes',
        },
    },
    ar: {
        headerName: 'المخزون',
        pageTitle: 'مخزوني',
        subtitle: 'أدر وتابع جميع دفعات المخزون في مكان واحد',
        addButton: 'إضافة دفعة جديدة',
        searchPlaceholder: 'ابحث في المخزون...',
        tableHeaders: ['المنتج', 'رقم الدفعة', 'الكمية', 'تاريخ الانتهاء', 'الملاحظات', 'الإجراءات'],
        prompts: {
            productId: 'أدخل معرّف المنتج (مثال: p101)',
            quantity: 'أدخل الكمية',
            expiryDate: 'أدخل تاريخ الانتهاء (YYYY-MM-DD)',
            batchNumber: 'أدخل رقم الدفعة',
            notes: 'أدخل الملاحظات',
        },
    },
};

const Stock = () => {
    const [stockData, setStockData] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
    const initialBatchState = {
        productId: '',
        batchNumber: '',
        quantity: '',
        expiryDate: '',
        notes: '',
    };
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBatch, setNewBatch] = useState(initialBatchState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now; replace with localStorage.getItem('token') after login

    useEffect(() => {
        fetchStock();
        fetchProducts();
    }, []);

    const fetchStock = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/stock/batches/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStockData(res.data);
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

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredStock = stockData.filter(batch => {
        const product = products.find(p => p._id === batch.productId) || {};
        return (
            batch.batchNumber?.toLowerCase().includes(searchQuery) ||
            product.name?.toLowerCase().includes(searchQuery) ||
            batch.notes?.toLowerCase().includes(searchQuery)
        );
    });

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/stock/batches/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchStock();  // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    const handleView = async (id) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/stock/batches/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Batch details:', res.data);  // Expand to modal or page
        } catch (err) {
            console.error(err);
        }
    };

    const openAddForm = () => {
        setNewBatch({
            ...initialBatchState,
            productId: products[0]?._id || '',
        });
        setFormError('');
        setShowAddForm(true);
    };

    const closeAddForm = () => {
        setShowAddForm(false);
        setIsSubmitting(false);
    };

    const handleBatchFieldChange = (field, value) => {
        setNewBatch((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddStock = () => {
        openAddForm();
    };

    const submitNewBatch = async (e) => {
        e.preventDefault();
        if (!newBatch.productId || !newBatch.batchNumber || !newBatch.quantity || !newBatch.expiryDate) {
            setFormError(language === 'ar' ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill the required fields.');
            return;
        }
        const payload = {
            _id: newBatch.batchNumber.trim(),
            productId: newBatch.productId,
            quantity: parseInt(newBatch.quantity, 10) || 0,
            expiryDate: newBatch.expiryDate,
            notes: newBatch.notes || undefined,
        };
        try {
            setIsSubmitting(true);
            await axios.post('http://localhost:3000/api/stock/batches/create', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            await fetchStock();
            closeAddForm();
        } catch (err) {
            console.error(err);
            const apiError = err.response?.data?.error || err.message || (language === 'ar' ? 'فشل إضافة الدفعة' : 'Failed to add batch');
            setFormError(apiError);
            setIsSubmitting(false);
        }
    };

    return (
        <div className={style.stockContainer}>
            <Header name={copy.headerName}/>
            <div className={style.stockHeader}>
                <div>
                    <h1 className={style.stockTitle}>{copy.pageTitle}</h1>
                    <p className={style.stockSubtitle}>{copy.subtitle}</p>
                </div>
                <button className={style.addStockBtn} onClick={handleAddStock}>
                    <FontAwesomeIcon icon={faPlus} /> {copy.addButton}
                </button>
            </div>

            {showAddForm && (
                <div className={style.inlineForm}>
                    <div className={style.formHeader}>
                        <h3>{copy.addButton}</h3>
                        <button type="button" className={style.closeBtn} onClick={closeAddForm} aria-label="Close add stock form">
                            ×
                        </button>
                    </div>
                    <form onSubmit={submitNewBatch}>
                        <div className={style.formGrid}>
                            <div className={style.formGroup}>
                                <label htmlFor="batch-product">{language === 'ar' ? 'المنتج*' : 'Product*'}</label>
                                <select
                                    id="batch-product"
                                    value={newBatch.productId}
                                    onChange={(e) => handleBatchFieldChange('productId', e.target.value)}
                                    required
                                >
                                    <option value="">{language === 'ar' ? 'اختر المنتج' : 'Select product'}</option>
                                    {products.map((product) => (
                                        <option key={product._id} value={product._id}>
                                            {product.name} ({product._id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="batch-number">{language === 'ar' ? 'رقم الدفعة*' : 'Batch number*'}</label>
                                <input
                                    id="batch-number"
                                    type="text"
                                    value={newBatch.batchNumber}
                                    onChange={(e) => handleBatchFieldChange('batchNumber', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="batch-quantity">{language === 'ar' ? 'الكمية*' : 'Quantity*'}</label>
                                <input
                                    id="batch-quantity"
                                    type="number"
                                    min="0"
                                    value={newBatch.quantity}
                                    onChange={(e) => handleBatchFieldChange('quantity', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="batch-expiry">{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry date'}</label>
                                <input
                                    id="batch-expiry"
                                    type="date"
                                    value={newBatch.expiryDate}
                                    onChange={(e) => handleBatchFieldChange('expiryDate', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="batch-notes">{language === 'ar' ? 'ملاحظات' : 'Notes'}</label>
                                <textarea
                                    id="batch-notes"
                                    value={newBatch.notes}
                                    onChange={(e) => handleBatchFieldChange('notes', e.target.value)}
                                />
                            </div>
                        </div>
                        {formError && <p className={style.formError}>{formError}</p>}
                        <div className={style.formActions}>
                            <button type="button" className={style.secondaryBtn} onClick={closeAddForm}>
                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button type="submit" className={style.primaryBtn} disabled={isSubmitting}>
                                {isSubmitting
                                    ? language === 'ar'
                                        ? 'جارٍ الحفظ...'
                                        : 'Saving...'
                                    : language === 'ar'
                                    ? 'حفظ الدفعة'
                                    : 'Save batch'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder={copy.searchPlaceholder} value={searchQuery} onChange={handleSearch} />
                </div>
            </div>

            <section className={style.stockList}>
                <div className={style.stockListHr}>
                    {copy.tableHeaders.map((header) => (
                        <div key={header} className={style.StockHrChild}>
                            {header} <FontAwesomeIcon icon={faSort} className={style.sortIcon} />
                        </div>
                    ))}
                </div>
                {filteredStock.map((batch) => {
                    const product = products.find(p => p._id === batch.productId) || {};
                    return (
                        <div key={batch._id} className={style.stockListRow}>
                            <div className={`${style.stockListChildItem} ${style.stockListFirstChildItem}`}>
                                <div className={style.stockIcon} style={{ backgroundColor: '#14b8a620' }}>
                                    <FontAwesomeIcon icon={faBoxes} style={{ color: '#14b8a6', fontSize: '20px' }} />
                                </div>
                                <div>
                                    <h4 className={style.stockName}>{product.name || batch.productId}</h4>
                                    <p className={style.stockDescription}>{product.category}</p>
                                </div>
                            </div>
                            <div className={style.stockListChildItem}>
                                <h4 className={style.batchNumber}>{batch.batchNumber}</h4>
                            </div>
                            <div className={style.stockListChildItem}>
                                <h4 className={style.quantity}>{batch.quantity}</h4>
                            </div>
                            <div className={style.stockListChildItem}>
                                <h4 className={style.expiryDate}>{batch.expiryDate}</h4>
                            </div>
                            <div className={style.stockListChildItem}>
                                <p className={style.notes}>{batch.notes}</p>
                            </div>
                            <div className={style.stockListChildItem}>
                                <div className={style.actionIcons}>
                                    <FontAwesomeIcon icon={faEye} onClick={() => handleView(batch._id)} />
                                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(batch._id)} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
};

export default Stock;