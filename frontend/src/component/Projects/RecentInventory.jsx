import React, { useState, useEffect, useMemo } from "react";
import "./RecentInventory.css";  // Renamed CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faExclamationTriangle, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from "../../context/LanguageContext";

const RecentInventory = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [lowStock, setLowStock] = useState(0);
    const [expiringSoon, setExpiringSoon] = useState(0);
    const { language } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Fetch total products
        fetch('http://localhost:3000/api/products/list', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setTotalProducts(data.length))
            .catch(err => console.error(err));

        // Low stock
        fetch('http://localhost:3000/api/stock/alerts/low-stock', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setLowStock(data.length))
            .catch(err => console.error(err));

        // Expiring soon
        fetch('http://localhost:3000/api/stock/alerts/expiring-soon', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setExpiringSoon(data.length))
            .catch(err => console.error(err));
    }, []);

    const summaryCards = useMemo(() => ([
        {
            key: 'total',
            title: language === 'ar' ? 'إجمالي المنتجات' : 'Total Products',
            icon: faBox,
            value: totalProducts,
            status: language === 'ar' ? '↑ +2 هذا الشهر' : '↑ +2 this month',
            statusClass: '',
        },
        {
            key: 'lowStock',
            title: language === 'ar' ? 'كميات منخفضة' : 'Low Stock',
            icon: faExclamationTriangle,
            value: lowStock,
            status: language === 'ar' ? '● دون الحد المسموح' : '● Below threshold',
            statusClass: 'in-progress',
        },
        {
            key: 'expiring',
            title: language === 'ar' ? 'تنتهي قريبًا' : 'Expiring Soon',
            icon: faExclamationTriangle,
            value: expiringSoon,
            status: language === 'ar' ? 'خلال 30 يومًا' : 'Within 30 days',
            statusClass: '',
        },
        {
            key: 'value',
            title: language === 'ar' ? 'القيمة الإجمالية' : 'Total Value',
            icon: faDollarSign,
            value: '$??K',
            status: language === 'ar' ? '↑ +12% عن الشهر الماضي' : '↑ +12% from last month',
            statusClass: 'success',
        },
    ]), [language, totalProducts, lowStock, expiringSoon]);

    return (
        <div className="dashboard-container">
            {/* Summary Section */}
            <div className="summary-container">
                {summaryCards.map((card) => (
                    <div className="summary-card" key={card.key}>
                        <div className="summary-header">
                            <span className="summary-title">{card.title}</span>
                            <FontAwesomeIcon icon={card.icon} className="summary-icon" />
                        </div>
                        <div className="summary-value">{card.value}</div>
                        <div className={`summary-status ${card.statusClass}`}>{card.status}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activities - Kept similar, adapt to inventory if more APIs */}
            <div className="activities-container">
                <h3 className="activities-header">
                    {language === 'ar' ? 'أحدث نشاطات المخزون' : 'Recent Inventory Activities'}
                </h3>

                <div className="activity-item">
                    <div className="activity-icon blue"><FontAwesomeIcon icon={faBox} /></div>
                    <div className="activity-content">
                        <div className="activity-title">
                            {language === 'ar' ? 'تمت إضافة منتج جديد:' : 'New product added:'} <span className="highlight">Super Chips</span>
                        </div>
                        <div className="activity-subtext">
                            {language === 'ar' ? 'أُضيف بواسطة المشرف' : 'Added by admin'}
                        </div>
                        <div className="activity-time">
                            {language === 'ar' ? 'منذ ساعتين' : '2 hours ago'}
                        </div>
                    </div>
                </div>

                {/* Add more or fetch real activities if API exists */}
                {/* ... similar for others */}
            </div>
        </div>
    );
};

export default RecentInventory;