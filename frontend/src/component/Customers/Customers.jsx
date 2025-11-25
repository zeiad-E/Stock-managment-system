import React, { useState, useEffect, useMemo } from 'react'
import style from './CustomersStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPlus, faTrash, faEye, faSearch, faSort, faUser } from '@fortawesome/free-solid-svg-icons'
import Header from '../Overview/OverviewChars/Header.jsx'
import { useLanguage } from '../../context/LanguageContext'

const copyMap = {
    en: {
        headerName: 'Customers',
        pageTitle: 'My Customers',
        subtitle: 'Manage and track all your customers in one place',
        addButton: 'Add New Customer',
        searchPlaceholder: 'Search customers...',
        deleteConfirm: 'Are you sure you want to delete this customer? This action cannot be undone.',
        deleteSuccess: 'Customer deleted successfully',
        deleteError: 'Failed to delete customer',
        addPrompts: {
            id: 'Enter ID (e.g., c1)',
            name: 'Enter name',
            contact: 'Enter contact person',
            phone: 'Enter phone',
            address: 'Enter address',
            notes: 'Enter notes',
        },
        tableHeaders: ['Customer name', 'Contact Person', 'Phone', 'Address', 'Action'],
    },
    ar: {
        headerName: 'العملاء',
        pageTitle: 'عملائي',
        subtitle: 'أدر وتابع جميع عملائك في مكان واحد',
        addButton: 'إضافة عميل جديد',
        searchPlaceholder: 'ابحث في العملاء...',
        deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذا العميل؟ هذا الإجراء لا يمكن التراجع عنه.',
        deleteSuccess: 'تم حذف العميل بنجاح',
        deleteError: 'فشل حذف العميل',
        addPrompts: {
            id: 'أدخل المعرّف (مثال: c1)',
            name: 'أدخل الاسم',
            contact: 'أدخل جهة الاتصال',
            phone: 'أدخل رقم الهاتف',
            address: 'أدخل العنوان',
            notes: 'أدخل الملاحظات',
        },
        tableHeaders: ['اسم العميل', 'جهة الاتصال', 'الهاتف', 'العنوان', 'الإجراءات'],
    },
}

const Customers = () => {
    const [customersData, setCustomersData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
    const initialCustomerState = {
        _id: '',
        name: '',
        contactPerson: '',
        phone: '',
        address: '',
        notes: '',
    };
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCustomer, setNewCustomer] = useState(initialCustomerState);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now; replace with localStorage.getItem('token') after login

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/customers/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setCustomersData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            try {
                const res = await fetch(`http://localhost:3000/api/customers/search?q=${query}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Search failed');
                const data = await res.json();
                setCustomersData(data);
            } catch (err) {
                console.error(err);
            }
        } else {
            fetchCustomers();
        }
    };
const handleDelete = async (id) => {
    if (!window.confirm(copy.deleteConfirm)) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const res = await fetch(`http://localhost:3000/api/customers/delete/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to delete customer');
        }

        // Show success message
        alert(data.message || copy.deleteSuccess);
        
        // Refresh the customers list
        fetchCustomers();
    } catch (err) {
        console.error('Delete error:', err);
        alert(err.message || copy.deleteError);
    }
};
    const handleView = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/customers/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('View failed');
            const data = await res.json();
            console.log('Customer details:', data);  // Expand to modal or page
        } catch (err) {
            console.error(err);
        }
    };

    const openAddForm = () => {
        setNewCustomer(initialCustomerState);
        setFormError('');
        setShowAddForm(true);
    };

    const closeAddForm = () => {
        setShowAddForm(false);
        setIsSubmitting(false);
    };

    const handleCustomerFieldChange = (field, value) => {
        setNewCustomer((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddCustomer = () => {
        openAddForm();
    };

    const submitNewCustomer = async (e) => {
        e.preventDefault();
        if (!newCustomer.name || !newCustomer.contactPerson || !newCustomer.phone) {
            setFormError(language === 'ar' ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill the required fields.');
            return;
        }
        try {
            setIsSubmitting(true);
            const res = await fetch('http://localhost:3000/api/customers/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCustomer)
            });
            if (!res.ok) throw new Error('Create failed');
            await fetchCustomers();
            closeAddForm();
        } catch (err) {
            console.error(err);
            setFormError(err.message || (language === 'ar' ? 'فشل إنشاء العميل' : 'Failed to create customer'));
            setIsSubmitting(false);
        }
    };

    return (
        <div className={style.customersContainer}>
            <Header name={copy.headerName}/>
            <div className={style.customersHeader}>
                <div>
                    <h1 className={style.customersTitle}>{copy.pageTitle}</h1>
                    <p className={style.customersSubtitle}>{copy.subtitle}</p>
                </div>
                <button className={style.addCustomerBtn} onClick={handleAddCustomer}>
                    <FontAwesomeIcon icon={faPlus} /> {copy.addButton}
                </button>
            </div>

            {showAddForm && (
                <div className={style.inlineForm}>
                    <div className={style.formHeader}>
                        <h3>{copy.addButton}</h3>
                        <button type="button" className={style.closeBtn} onClick={closeAddForm} aria-label="Close add customer form">
                            ×
                        </button>
                    </div>
                    <form onSubmit={submitNewCustomer}>
                        <div className={style.formGrid}>
                            <div className={style.formGroup}>
                                <label htmlFor="customer-id">{language === 'ar' ? 'معرّف العميل' : 'Customer ID'}</label>
                                <input
                                    id="customer-id"
                                    type="text"
                                    value={newCustomer._id}
                                    onChange={(e) => handleCustomerFieldChange('_id', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="customer-name">{language === 'ar' ? 'اسم العميل*' : 'Customer name*'}</label>
                                <input
                                    id="customer-name"
                                    type="text"
                                    value={newCustomer.name}
                                    onChange={(e) => handleCustomerFieldChange('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="customer-contact">{language === 'ar' ? 'جهة الاتصال*' : 'Contact person*'}</label>
                                <input
                                    id="customer-contact"
                                    type="text"
                                    value={newCustomer.contactPerson}
                                    onChange={(e) => handleCustomerFieldChange('contactPerson', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="customer-phone">{language === 'ar' ? 'الهاتف*' : 'Phone*'}</label>
                                <input
                                    id="customer-phone"
                                    type="tel"
                                    value={newCustomer.phone}
                                    onChange={(e) => handleCustomerFieldChange('phone', e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="customer-address">{language === 'ar' ? 'العنوان' : 'Address'}</label>
                                <input
                                    id="customer-address"
                                    type="text"
                                    value={newCustomer.address}
                                    onChange={(e) => handleCustomerFieldChange('address', e.target.value)}
                                />
                            </div>
                            <div className={style.formGroup}>
                                <label htmlFor="customer-notes">{language === 'ar' ? 'ملاحظات' : 'Notes'}</label>
                                <textarea
                                    id="customer-notes"
                                    value={newCustomer.notes}
                                    onChange={(e) => handleCustomerFieldChange('notes', e.target.value)}
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
                                    ? 'حفظ العميل'
                                    : 'Save customer'}
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

            <section className={style.customerList}>
                <div className={style.customerListHr}>
                    {copy.tableHeaders.map((header) => (
                        <div key={header} className={style.CustomerHrChild}>
                            {header} <FontAwesomeIcon icon={faSort} className={style.sortIcon} />
                        </div>
                    ))}
                </div>
                {customersData.map((customer) => (
                    <div key={customer._id} className={style.customerListRow}>
                        <div className={`${style.customerListChildItem} ${style.customerListFirstChildItem}`}>
                            <div className={style.customerIcon} style={{ backgroundColor: '#22c55e20' }}>
                                <FontAwesomeIcon icon={faUsers} style={{ color: '#22c55e', fontSize: '20px' }} />
                            </div>
                            <div>
                                <h4 className={style.customerName}>{customer.name}</h4>
                                <p className={style.customerDescription}>{customer.notes}</p>
                            </div>
                        </div>
                        <div className={style.customerListChildItem}>
                            <div className={style.contactInfo}>
                                <div className={style.contactAvatar}><FontAwesomeIcon icon={faUser} /></div>
                                <div>
                                    <h4 className={style.contactName}>{customer.contactPerson}</h4>
                                </div>
                            </div>
                        </div>
                        <div className={style.customerListChildItem}>
                            <h4 className={style.phone}>{customer.phone}</h4>
                        </div>
                        <div className={style.customerListChildItem}>
                            <h4 className={style.address}>{customer.address}</h4>
                        </div>
                        <div className={style.customerListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => handleView(customer._id)} />
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(customer._id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}

export default Customers;