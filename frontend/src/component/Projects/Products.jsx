import React, { useState, useEffect, useMemo } from 'react'
import style from './ProductsStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faPlus, faTrash, faEye, faSearch, faSort, faUser } from '@fortawesome/free-solid-svg-icons'
import Header from '../Overview/OverviewChars/Header.jsx'
import RecentInventory from './RecentInventory.jsx'
import { useLanguage } from '../../context/LanguageContext'

const localizedCopy = {
    en: {
        headerName: 'Products',
        pageTitle: 'My Products',
        subtitle: 'Manage and track all your products in one place',
        addButton: 'Add New Product',
        searchPlaceholder: 'Search products...',
        allCategories: 'All Categories',
        allSuppliers: 'All Suppliers',
        loading: 'Loading products...',
        errorPrefix: 'Error',
        retry: 'Retry',
        empty: 'No products found. Add your first product to get started.',
        tableHeaders: ['ID', 'Product name', 'Supplier', 'Buy Price', 'Sell Price', 'Barcode', 'Action'],
        supplierIdLabel: 'Supplier ID',
        buyLabel: 'Buy',
        sellLabel: 'Sell',
        prompts: {
            id: 'Enter ID (e.g., p101)',
            name: 'Enter name',
            category: 'Enter category',
            buyPrice: 'Enter buy price',
            sellPrice: 'Enter sell price',
            barcode: 'Enter barcode',
            supplierId: 'Enter supplier ID',
        },
    },
    ar: {
        headerName: 'المنتجات',
        pageTitle: 'منتجاتي',
        subtitle: 'أدر وتابع جميع منتجاتك في مكان واحد',
        addButton: 'إضافة منتج جديد',
        searchPlaceholder: 'ابحث في المنتجات...',
        allCategories: 'كل الفئات',
        allSuppliers: 'جميع الموردين',
        loading: 'جارٍ تحميل المنتجات...',
        errorPrefix: 'خطأ',
        retry: 'إعادة المحاولة',
        empty: 'لا توجد منتجات. أضف منتجك الأول للبدء.',
        tableHeaders: ['المعرف', 'اسم المنتج', 'المورد', 'سعر الشراء', 'سعر البيع', 'الباركود', 'الإجراءات'],
        supplierIdLabel: 'معرّف المورد',
        buyLabel: 'شراء',
        sellLabel: 'بيع',
        prompts: {
            id: 'أدخل المعرّف (مثال: p101)',
            name: 'أدخل الاسم',
            category: 'أدخل الفئة',
            buyPrice: 'أدخل سعر الشراء',
            sellPrice: 'أدخل سعر البيع',
            barcode: 'أدخل الباركود',
            supplierId: 'أدخل معرّف المورد',
        },
    },
}

const Products = () => {
    const [productsData, setProductsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const initialProductState = {
        _id: '',
        name: '',
        category: '',
        buyPrice: '',
        sellPrice: '',
        barcode: '',
        supplierId: '',
    };
    const [newProduct, setNewProduct] = useState(initialProductState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const { language } = useLanguage();
    const copy = useMemo(() => localizedCopy[language], [language]);

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
    }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const res = await fetch('http://localhost:3000/api/products/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProductsData(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch('http://localhost:3000/api/suppliers/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch suppliers');
            const data = await res.json();
            setSuppliers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/products/search?q=${query}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Search failed');
                const data = await res.json();
                setProductsData(data);
            } catch (err) {
                console.error(err);
            }
        } else {
            fetchProducts();
        }
    };

    const handleDelete = async (id) => {
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxNjA3LCJleHAiOjE3NjM5MTgwMDd9.nDKG-Zcx3HvM1zArAmMkukClDEvKWbowv1RnT-E95Jw";
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/products/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Delete failed');
            fetchProducts();  // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    const openAddForm = () => {
        setFormError('');
        setNewProduct(initialProductState);
        setShowAddForm(true);
    };

    const closeAddForm = () => {
        setShowAddForm(false);
        setIsSubmitting(false);
    };

    const handleProductFieldChange = (field, value) => {
        setNewProduct((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddProduct = () => {
        openAddForm();
    };

    const submitNewProduct = async (e) => {
        e.preventDefault();
        if (!newProduct._id || !newProduct.name || !newProduct.supplierId) {
            setFormError(language === 'ar' ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill the required fields.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setFormError(language === 'ar' ? 'لم يتم العثور على رمز المصادقة' : 'Missing authentication token.');
            return;
        }
        const payload = {
            ...newProduct,
            buyPrice: parseFloat(newProduct.buyPrice || 0),
            sellPrice: parseFloat(newProduct.sellPrice || 0),
        };
        try {
            setIsSubmitting(true);
            const res = await fetch('http://localhost:3000/api/products/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Create failed');
            await fetchProducts();
            closeAddForm();
        } catch (err) {
            console.error(err);
            setFormError(err.message || 'Failed to create product');
            setIsSubmitting(false);
        }
    };

    // Optional: Fetch suppliers to map ID to name
    // const [suppliers, setSuppliers] = useState([]);
    // useEffect(() => { fetch('http://localhost:3000/api/suppliers/list', {headers...}).then... }, []);
    // Then in render: suppliers.find(s => s._id === product.supplierId)?.name || product.supplierId

    return (
        <div className={style.productsContainer}>
            <Header name={copy.headerName}/>
            <div className={style.productsHeader}>
                <div>
                    <h1 className={style.productsTitle}>{copy.pageTitle}</h1>
                    <p className={style.productsSubtitle}>{copy.subtitle}</p>
                </div>
                <button className={style.addProductBtn} onClick={handleAddProduct}>
                    <FontAwesomeIcon icon={faPlus} /> {copy.addButton}
                </button>
            </div>

            {showAddForm && (
                <div className={style.inlineForm}>
                    <div className={style.formHeader}>
                        <h3>{copy.addButton}</h3>
                        <button type="button" className={style.closeBtn} onClick={closeAddForm} aria-label="Close add product form">
                            ×
                        </button>
                    </div>
                    <form onSubmit={submitNewProduct}>
                        <div className={style.formGrid}>
                            <div className={style.formGroup}>
                                <label htmlFor="product-id">{language === 'ar' ? 'معرّف المنتج*' : 'Product ID*'}</label>
                                <input
                                    id="product-id"
                                    type="text"
                                    value={newProduct._id}
                                    onChange={(e) => handleProductFieldChange('_id', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="product-name">{language === 'ar' ? 'اسم المنتج*' : 'Product name*'}</label>
                                <input
                                    id="product-name"
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => handleProductFieldChange('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="product-category">{language === 'ar' ? 'الفئة' : 'Category'}</label>
                                <input
                                    id="product-category"
                                    type="text"
                                    value={newProduct.category}
                                    onChange={(e) => handleProductFieldChange('category', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="product-supplier">{language === 'ar' ? 'المورد*' : 'Supplier*'}</label>
                                <select
                                    id="product-supplier"
                                    value={newProduct.supplierId}
                                    onChange={(e) => handleProductFieldChange('supplierId', e.target.value)}
                                    required
                                >
                                    <option value="">{language === 'ar' ? 'اختر المورد' : 'Select supplier'}</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier._id} value={supplier._id}>
                                            {supplier.name} ({supplier._id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="buy-price">{language === 'ar' ? 'سعر الشراء' : 'Buy price'}</label>
                                <input
                                    id="buy-price"
                                    type="number"
                                    step="0.01"
                                    value={newProduct.buyPrice}
                                    onChange={(e) => handleProductFieldChange('buyPrice', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="sell-price">{language === 'ar' ? 'سعر البيع' : 'Sell price'}</label>
                                <input
                                    id="sell-price"
                                    type="number"
                                    step="0.01"
                                    value={newProduct.sellPrice}
                                    onChange={(e) => handleProductFieldChange('sellPrice', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="barcode">{language === 'ar' ? 'الباركود' : 'Barcode'}</label>
                                <input
                                    id="barcode"
                                    type="text"
                                    value={newProduct.barcode}
                                    onChange={(e) => handleProductFieldChange('barcode', e.target.value)}
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
                                    ? 'حفظ المنتج'
                                    : 'Save product'}
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
                <select className={style.filterSelect}>
                    <option>{copy.allCategories}</option>
                </select>
                <select className={style.filterSelect}>
                    <option>{copy.allSuppliers}</option>
                </select>
            </div>

            {isLoading ? (
                <div className={style.loadingState}>
                    <p>{copy.loading}</p>
                </div>
            ) : error ? (
                <div className={style.errorState}>
                    <p>{copy.errorPrefix}: {error}</p>
                    <button onClick={fetchProducts}>{copy.retry}</button>
                </div>
            ) : productsData.length === 0 ? (
                <div className={style.emptyState}>
                    <p>{copy.empty}</p>
                </div>
            ) : (
                <div className={style.productList}>
                <div className={style.productListHr}>
                    {copy.tableHeaders.map((header) => (
                        <div key={header} className={style.ProductHrChild}>
                            {header} <FontAwesomeIcon icon={faSort} className={style.sortIcon} />
                        </div>
                    ))}
                </div>
                {productsData.map((product) => (
                    <div key={product._id} className={style.productListRow}>
                        <div className={style.productListChildItem}>
                            <h4 className={style.budgetAmount}>{product._id}</h4>
                        </div>
                        <div className={`${style.productListChildItem} ${style.productListFirstChildItem}`}>
                            <div className={style.productIcon} style={{ backgroundColor: '#a855f720' }}>
                                <FontAwesomeIcon icon={faBox} style={{ color: '#a855f7', fontSize: '20px' }} />
                            </div>
                            <div>
                                <h4 className={style.productName}>{product.name}</h4>
                                <p className={style.productDescription}>{product.category}</p>
                            </div>
                        </div>
                        <div className={style.productListChildItem}>
                            <div className={style.clientInfo}>  {/* Reused as supplierInfo */}
                                <div className={style.clientAvatar}><FontAwesomeIcon icon={faUser} /></div>
                                <div>
                                    <h4 className={style.clientName}>{product.supplierId}</h4>
                                    <p className={style.clientContact}>{copy.supplierIdLabel}</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.productListChildItem}>
                            <div className={style.budgetInfo}>
                                <h4 className={style.budgetAmount}>${product.buyPrice ? product.buyPrice.toFixed(2) : '0.00'}</h4>
                                <p className={style.budgetType}>{copy.buyLabel}</p>
                            </div>
                        </div>
                        <div className={style.productListChildItem}>
                            <div className={style.budgetInfo}>
                                <h4 className={style.budgetAmount}>${product.sellPrice ? product.sellPrice.toFixed(2) : '0.00'}</h4>
                                <p className={style.budgetType}>{copy.sellLabel}</p>
                            </div>
                        </div>
                        <div className={style.productListChildItem}>
                            <h4 className={style.budgetAmount}>{product.barcode}</h4>
                        </div>
                        <div className={style.productListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => console.log('View', product._id)} />  {/* Add view logic */}
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(product._id)} />
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}

            <section className={style.RecentProduct}>
                <RecentInventory/>
            </section>
        </div>
    )
}

export default Products;