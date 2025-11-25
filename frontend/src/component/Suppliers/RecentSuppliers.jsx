import React, { useMemo } from "react";
import "./RecentSuppliers.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faUserCheck, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from "../../context/LanguageContext";

const RecentSuppliers = ({ suppliersCount }) => {
    const { language } = useLanguage();
    const cards = useMemo(() => ([
        {
            key: 'total',
            title: language === 'ar' ? 'إجمالي الموردين' : 'Total Suppliers',
            icon: faBuilding,
            value: suppliersCount,
            status: language === 'ar' ? '↑ +1 هذا الشهر' : '↑ +1 this month',
            statusClass: '',
        },
        {
            key: 'active',
            title: language === 'ar' ? 'الموردون النشطون' : 'Active Suppliers',
            icon: faUserCheck,
            value: Math.round(suppliersCount * 0.8),
            status: language === 'ar' ? '● نشطون حاليًا' : '● Currently active',
            statusClass: 'in-progress',
        },
        {
            key: 'spend',
            title: language === 'ar' ? 'إجمالي الإنفاق' : 'Total Spend',
            icon: faDollarSign,
            value: '$??K',
            status: language === 'ar' ? '↑ +10% عن الشهر الماضي' : '↑ +10% from last month',
            statusClass: 'success',
        },
    ]), [language, suppliersCount]);

    return (
        <div className="dashboard-container">
            {/* Summary Section */}
            <div className="summary-container">
                {cards.map((card) => (
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

            {/* Recent Activities - Static examples */}
            <div className="activities-container">
                <h3 className="activities-header">
                    {language === 'ar' ? 'أحدث نشاطات الموردين' : 'Recent Supplier Activities'}
                </h3>

                <div className="activity-item">
                    <div className="activity-icon blue"><FontAwesomeIcon icon={faBuilding} /></div>
                    <div className="activity-content">
                        <div className="activity-title">
                            {language === 'ar' ? 'تمت إضافة مورد جديد:' : 'New supplier added:'} <span className="highlight">Golden Foods Co.</span>
                        </div>
                        <div className="activity-subtext">
                            {language === 'ar' ? 'أُضيف بواسطة المشرف' : 'Added by admin'}
                        </div>
                        <div className="activity-time">
                            {language === 'ar' ? 'منذ ساعتين' : '2 hours ago'}
                        </div>
                    </div>
                </div>

                <div className="activity-item">
                    <div className="activity-icon green">✅</div>
                    <div className="activity-content">
                        <div className="activity-title">
                            {language === 'ar' ? 'تم تحديث المورد:' : 'Supplier updated:'} <span className="highlight">Supplier XYZ</span>
                        </div>
                        <div className="activity-subtext">
                            {language === 'ar' ? 'تم تعديل بيانات التواصل' : 'Contact details changed'}
                        </div>
                        <div className="activity-time">
                            {language === 'ar' ? 'منذ 5 ساعات' : '5 hours ago'}
                        </div>
                    </div>
                </div>

                <div className="activity-item">
                    <div className="activity-icon red">❌</div>
                    <div className="activity-content">
                        <div className="activity-title">
                            {language === 'ar' ? 'تم حذف المورد:' : 'Supplier deleted:'} <span className="highlight">Old Supplier</span>
                        </div>
                        <div className="activity-subtext">
                            {language === 'ar' ? 'أُزيل بواسطة المشرف' : 'Removed by admin'}
                        </div>
                        <div className="activity-time">
                            {language === 'ar' ? 'منذ يومين' : '2 days ago'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentSuppliers;