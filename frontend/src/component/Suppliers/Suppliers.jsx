import React, { useState, useEffect, useMemo } from 'react'
import style from './SuppliersStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faPlus, faTrash, faEye, faSearch, faSort, faUser } from '@fortawesome/free-solid-svg-icons'
import Header from '../Overview/OverviewChars/Header.jsx'
import RecentSuppliers from './RecentSuppliers.jsx';
import { useLanguage } from '../../context/LanguageContext'

const copyMap = {
    en: {
        headerName: 'Suppliers',
        pageTitle: 'My Suppliers',
        subtitle: 'Manage and track all your suppliers in one place',
        addButton: 'Add New Supplier',
        searchPlaceholder: 'Search suppliers...',
        deleteConfirm: 'Are you sure you want to delete this supplier?',
        deleteSuccess: 'Supplier deleted successfully',
        deleteError: 'An error occurred while deleting the supplier',
        addPrompts: {
            id: 'Enter ID (e.g., s1)',
            name: 'Enter name',
            contact: 'Enter contact person',
            phone: 'Enter phone',
            email: 'Enter email',
            address: 'Enter address',
            notes: 'Enter notes',
        },
        tableHeaders: ['ID', 'Supplier name', 'Contact', 'Email', 'Address', 'Action'],
    },
    ar: {
        headerName: 'الموردون',
        pageTitle: 'مورديني',
        subtitle: 'أدر وتابع جميع مورديك في مكان واحد',
        addButton: 'إضافة مورد جديد',
        searchPlaceholder: 'ابحث في الموردين...',
        deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذا المورد؟',
        deleteSuccess: 'تم حذف المورد بنجاح',
        deleteError: 'حدث خطأ أثناء حذف المورد',
        addPrompts: {
            id: 'أدخل المعرّف (مثال: s1)',
            name: 'أدخل الاسم',
            contact: 'أدخل جهة الاتصال',
            phone: 'أدخل الهاتف',
            email: 'أدخل البريد الإلكتروني',
            address: 'أدخل العنوان',
            notes: 'أدخل الملاحظات',
        },
        tableHeaders: ['المعرف', 'اسم المورد', 'جهة الاتصال', 'البريد الإلكتروني', 'العنوان', 'الإجراءات'],
    },
}

const Suppliers = () => {
    const [suppliersData, setSuppliersData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
    const initialSupplierState = {
        _id: '',
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    };
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSupplier, setNewSupplier] = useState(initialSupplierState);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now; replace with localStorage.getItem('token') after login

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/suppliers/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setSuppliersData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredSuppliers = suppliersData.filter(supplier => 
        supplier.name.toLowerCase().includes(searchQuery) ||
        supplier.contactPerson.toLowerCase().includes(searchQuery) ||
        supplier.phone.includes(searchQuery) ||
        supplier.email.toLowerCase().includes(searchQuery)
    );

    // const handleDelete = async (id) => {
    //     try {
    //         const res = await fetch(`http://localhost:3000/api/suppliers/delete/${id}`, {
    //             method: 'DELETE',
    //             headers: { 'Authorization': `Bearer ${token}` }
    //         });
    //         if (!res.ok) throw new Error('Delete failed');
    //         fetchSuppliers();  // Refresh list
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const handleDelete = async (id) => {
    if (!window.confirm(copy.deleteConfirm)) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/suppliers/delete/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || copy.deleteError);
        }

        alert(copy.deleteSuccess);
        
        // Refresh the suppliers list
        fetchSuppliers();
    } catch (err) {
        console.error('Delete error:', err);
        alert(err.message || copy.deleteError);
    }
};

    const handleView = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/suppliers/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('View failed');
            const data = await res.json();
            console.log('Supplier details:', data);  // Expand to modal or page
        } catch (err) {
            console.error(err);
        }
    };

    const openAddForm = () => {
        setNewSupplier(initialSupplierState);
        setFormError('');
        setShowAddForm(true);
    };

    const closeAddForm = () => {
        setShowAddForm(false);
        setIsSubmitting(false);
    };

    const handleSupplierFieldChange = (field, value) => {
        setNewSupplier((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddSupplier = () => {
        openAddForm();
    };

    const submitNewSupplier = async (e) => {
        e.preventDefault();
        if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.phone) {
            setFormError(language === 'ar' ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill the required fields.');
            return;
        }
        try {
            setIsSubmitting(true);
            const res = await fetch('http://localhost:3000/api/suppliers/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSupplier)
            });
            if (!res.ok) throw new Error('Create failed');
            await fetchSuppliers();
            closeAddForm();
        } catch (err) {
            console.error(err);
            setFormError(err.message || (language === 'ar' ? 'فشل إنشاء المورد' : 'Failed to create supplier'));
            setIsSubmitting(false);
        }
    };

    return (
        <div className={style.suppliersContainer}>
            <Header name={copy.headerName}/>
            <div className={style.suppliersHeader}>
                <div>
                    <h1 className={style.suppliersTitle}>{copy.pageTitle}</h1>
                    <p className={style.suppliersSubtitle}>{copy.subtitle}</p>
                </div>
                <button className={style.addSupplierBtn} onClick={handleAddSupplier}>
                    <FontAwesomeIcon icon={faPlus} /> {copy.addButton}
                </button>
            </div>

            {showAddForm && (
                <div className={style.inlineForm}>
                    <div className={style.formHeader}>
                        <h3>{copy.addButton}</h3>
                        <button type="button" className={style.closeBtn} onClick={closeAddForm} aria-label="Close add supplier form">
                            ×
                        </button>
                    </div>
                    <form onSubmit={submitNewSupplier}>
                        <div className={style.formGrid}>
                            <div className={style.formGroup}>
                                <label htmlFor="supplier-id">{language === 'ar' ? 'معرّف المورد' : 'Supplier ID'}</label>
                                <input
                                    id="supplier-id"
                                    type="text"
                                    value={newSupplier._id}
                                    onChange={(e) => handleSupplierFieldChange('_id', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="supplier-name">{language === 'ar' ? 'اسم المورد*' : 'Supplier name*'}</label>
                                <input
                                    id="supplier-name"
                                    type="text"
                                    value={newSupplier.name}
                                    onChange={(e) => handleSupplierFieldChange('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="supplier-contact">{language === 'ar' ? 'جهة الاتصال*' : 'Contact person*'}</label>
                                <input
                                    id="supplier-contact"
                                    type="text"
                                    value={newSupplier.contactPerson}
                                    onChange={(e) => handleSupplierFieldChange('contactPerson', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="supplier-phone">{language === 'ar' ? 'الهاتف*' : 'Phone*'}</label>
                                <input
                                    id="supplier-phone"
                                    type="tel"
                                    value={newSupplier.phone}
                                    onChange={(e) => handleSupplierFieldChange('phone', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="supplier-email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                <input
                                    id="supplier-email"
                                    type="email"
                                    value={newSupplier.email}
                                    onChange={(e) => handleSupplierFieldChange('email', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="supplier-address">{language === 'ar' ? 'العنوان' : 'Address'}</label>
                                <input
                                    id="supplier-address"
                                    type="text"
                                    value={newSupplier.address}
                                    onChange={(e) => handleSupplierFieldChange('address', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="supplier-notes">{language === 'ar' ? 'ملاحظات' : 'Notes'}</label>
                                <textarea
                                    id="supplier-notes"
                                    value={newSupplier.notes}
                                    onChange={(e) => handleSupplierFieldChange('notes', e.target.value)}
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
                                    ? 'حفظ المورد'
                                    : 'Save supplier'}
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

            <section className={style.supplierList}>
                <div className={style.supplierListHr}>
                    {copy.tableHeaders.map((header) => (
                        <div key={header} className={style.SupplierHrChild}>
                            {header} <FontAwesomeIcon icon={faSort} className={style.sortIcon} />
                        </div>
                    ))}
                </div>
                {filteredSuppliers.map((supplier) => (
                    <div key={supplier._id} className={style.supplierListRow}>
                        <div className={style.supplierListChildItem}>
                            <h4 className={style.supplierId}>{supplier._id}</h4>
                        </div>
                        <div className={`${style.supplierListChildItem} ${style.supplierListFirstChildItem}`}>
                            <div className={style.supplierIcon} style={{ backgroundColor: '#3b82f620' }}>
                                <FontAwesomeIcon icon={faBuilding} style={{ color: '#3b82f6', fontSize: '20px' }} />
                            </div>
                            <div>
                                <h4 className={style.supplierName}>{supplier.name}</h4>
                                <p className={style.supplierDescription}>{supplier.notes}</p>
                            </div>
                        </div>
                        <div className={style.supplierListChildItem}>
                            <div className={style.contactInfo}>
                                <div className={style.contactAvatar}><FontAwesomeIcon icon={faUser} /></div>
                                <div>
                                    <h4 className={style.contactName}>{supplier.contactPerson}</h4>
                                    <p className={style.contactPhone}>{supplier.phone}</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.supplierListChildItem}>
                            <h4 className={style.email}>{supplier.email}</h4>
                        </div>
                        <div className={style.supplierListChildItem}>
                            <h4 className={style.address}>{supplier.address}</h4>
                        </div>
                        <div className={style.supplierListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => handleView(supplier._id)} />
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(supplier._id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section className={style.RecentSupplier}>
                <RecentSuppliers suppliersCount={suppliersData.length} />
            </section>
        </div>
    )
}

export default Suppliers;