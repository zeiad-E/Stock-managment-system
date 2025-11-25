import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import style from './SalesHistoryStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort, faEye } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';
import { useLanguage } from '../../context/LanguageContext';

const copyMap = {
    en: {
        headerName: 'Sales History',
        pageTitle: 'Sales History',
        subtitle: 'View all customer bills and transactions',
        searchPlaceholder: 'Search sales...',
        tableHeaders: ['Invoice ID', 'Date', 'Customer', 'Grand Total', 'Payment Status', 'Action'],
        paymentMap: { paid: 'Paid', unpaid: 'Unpaid' },
    },
    ar: {
        headerName: 'سجل المبيعات',
        pageTitle: 'سجل المبيعات',
        subtitle: 'استعرض جميع فواتير العملاء والمعاملات',
        searchPlaceholder: 'ابحث في المبيعات...',
        tableHeaders: ['رقم الفاتورة', 'التاريخ', 'العميل', 'الإجمالي', 'حالة الدفع', 'الإجراءات'],
        paymentMap: { paid: 'مدفوع', unpaid: 'غير مدفوع' },
    },
};

const SalesHistory = () => {
    const [salesData, setSalesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
const token = localStorage.getItem('token');
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/customer-bills/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSalesData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredSales = salesData.filter(sale => 
        sale._id.toLowerCase().includes(searchQuery) ||
        sale.customerId.name.toLowerCase().includes(searchQuery) ||
        sale.paymentStatus.toLowerCase().includes(searchQuery)
    );

    const handleView = (id) => {
        // Placeholder: Could fetch details if single bill endpoint exists
        console.log('View sale:', id);
    };

    return (
        <div className={style.salesContainer}>
            <Header name={copy.headerName}/>
            <div className={style.salesHeader}>
                <div>
                    <h1 className={style.salesTitle}>{copy.pageTitle}</h1>
                    <p className={style.salesSubtitle}>{copy.subtitle}</p>
                </div>
            </div>

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder={copy.searchPlaceholder} value={searchQuery} onChange={handleSearch} />
                </div>
            </div>

            <section className={style.salesList}>
                <div className={style.salesListHr}>
                    {copy.tableHeaders.map((header, index) => (
                        <div key={header} className={style.SalesHrChild}>
                            {header}
                            {index < copy.tableHeaders.length - 1 && <FontAwesomeIcon icon={faSort} className={style.sortIcon} />}
                        </div>
                    ))}
                </div>
                {filteredSales.map((sale) => (
                    <div key={sale._id} className={style.salesListRow}>
                        <div className={style.salesListChildItem}>
                            <h4 className={style.invoiceId}>{sale._id}</h4>
                        </div>
                        <div className={style.salesListChildItem}>
                            <h4 className={style.date}>{new Date(sale.date).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</h4>
                        </div>
                        <div className={style.salesListChildItem}>
                            <div className={style.customerInfo}>
                                <h4 className={style.customerName}>{sale.customerId.name}</h4>
                                <p className={style.customerPhone}>{sale.customerId.phone}</p>
                            </div>
                        </div>
                        <div className={style.salesListChildItem}>
                            <h4 className={style.grandTotal}>${sale.grandTotal}</h4>
                        </div>
                        <div className={style.salesListChildItem}>
                            <span className={`${style.statusBadge} ${style[sale.paymentStatus.toLowerCase()]}`}>
                                {copy.paymentMap[sale.paymentStatus.toLowerCase()] || sale.paymentStatus}
                            </span>
                        </div>
                        <div className={style.salesListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => handleView(sale._id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default SalesHistory;