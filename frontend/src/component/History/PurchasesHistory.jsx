import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import style from './PurchasesHistoryStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort, faEye } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';
import { useLanguage } from '../../context/LanguageContext';

const copyMap = {
    en: {
        headerName: 'Purchases History',
        pageTitle: 'Purchases History',
        subtitle: 'View all supplier bills and transactions',
        searchPlaceholder: 'Search purchases...',
        tableHeaders: ['Bill ID', 'Date', 'Supplier', 'Grand Total', 'Payment Status', 'Action'],
        paymentMap: { paid: 'Paid', unpaid: 'Unpaid' },
    },
    ar: {
        headerName: 'سجل المشتريات',
        pageTitle: 'سجل المشتريات',
        subtitle: 'استعرض جميع فواتير الموردين والمعاملات',
        searchPlaceholder: 'ابحث في المشتريات...',
        tableHeaders: ['رقم الفاتورة', 'التاريخ', 'المورد', 'الإجمالي', 'حالة الدفع', 'الإجراءات'],
        paymentMap: { paid: 'مدفوع', unpaid: 'غير مدفوع' },
    },
};

const PurchasesHistory = () => {
    const [purchasesData, setPurchasesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
const token = localStorage.getItem('token');
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/supplier-bills/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPurchasesData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredPurchases = purchasesData.filter(purchase => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (purchase._id?.toLowerCase() || '').includes(searchLower) ||
            (purchase.supplierId?.name?.toLowerCase() || '').includes(searchLower) ||
            (purchase.paymentStatus?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleView = (id) => {
        console.log('View purchase:', id);
        // Placeholder: Could fetch details if single bill endpoint exists
    };

    return (
        <div className={style.purchasesContainer}>
            <Header name={copy.headerName}/>
            <div className={style.purchasesHeader}>
                <div>
                    <h1 className={style.purchasesTitle}>{copy.pageTitle}</h1>
                    <p className={style.purchasesSubtitle}>{copy.subtitle}</p>
                </div>
            </div>

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder={copy.searchPlaceholder} value={searchQuery} onChange={handleSearch} />
                </div>
            </div>

            <section className={style.purchasesList}>
                <div className={style.purchasesListHr}>
                    {copy.tableHeaders.map((header, index) => (
                        <div key={header} className={style.PurchasesHrChild}>
                            {header}
                            {index < copy.tableHeaders.length - 1 && <FontAwesomeIcon icon={faSort} className={style.sortIcon} />}
                        </div>
                    ))}
                </div>
                {filteredPurchases.map((purchase) => (
                    <div key={purchase._id} className={style.purchasesListRow}>
                        <div className={style.purchasesListChildItem}>
                            <h4 className={style.billId}>{purchase._id}</h4>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <h4 className={style.date}>{new Date(purchase.date).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</h4>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <div className={style.supplierInfo}>
                                <h4 className={style.supplierName}>
                                    {purchase.supplierId?.name || 'No Supplier'}
                                </h4>
                                <p className={style.supplierEmail}>
                                    {purchase.supplierId?.email || 'No Email'}
                                </p>
                            </div>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <h4 className={style.grandTotal}>${purchase.grandTotal}</h4>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <span className={`${style.statusBadge} ${style[purchase.paymentStatus.toLowerCase()]}`}>
                                {copy.paymentMap[purchase.paymentStatus.toLowerCase()] || purchase.paymentStatus}
                            </span>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => handleView(purchase._id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default PurchasesHistory;