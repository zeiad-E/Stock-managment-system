import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './OverviewStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MonthlyEarnings from './OverviewChars/MonthlyEarning.jsx';
import TaskDistribution from './OverviewChars/TaskDistribution.jsx';
import { 
    faFolder, 
    faPlus, 
    faChevronRight, 
    faDollarSign, 
    faClock, 
    faEllipsisV, 
    faMobile,
    faStar,
    faBell,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import Header from './OverviewChars/Header.jsx';
import { useLanguage } from '../../context/LanguageContext';

const getStatsCards = (language, profitStats, profitLoading, profitError) => {
    const formatCurrency = (amount) => {
        if (profitLoading) {
            return language === 'ar' ? '...جارٍ التحميل' : 'Loading...';
        }
        if (profitError) {
            return language === 'ar' ? 'خطأ' : 'Error';
        }
        const value = Number(amount) || 0;
        return `$${value.toFixed(2)}`;
    };

    return [
        {
            key: 'revenue',
            icon: faDollarSign,
            value: formatCurrency(profitStats.totalRevenue),
            label: { en: 'Total Revenue', ar: 'إجمالي الإيرادات' },
            note: { en: 'All-time sales', ar: 'إجمالي المبيعات الكلية' },
            wrapperClass: 'dollar',
        },
        {
            key: 'cost',
            icon: faDollarSign,
            value: formatCurrency(profitStats.totalCost),
            label: { en: 'Total Cost', ar: 'إجمالي التكلفة' },
            note: { en: 'All-time purchase cost', ar: 'إجمالي تكلفة المشتريات' },
            wrapperClass: 'clock',
        },
        {
            key: 'netProfit',
            icon: faDollarSign,
            value: formatCurrency(profitStats.netProfit),
            label: { en: 'Net Profit', ar: 'صافي الربح' },
            note: { en: 'Revenue - cost', ar: 'الإيرادات - التكلفة' },
            wrapperClass: 'bell',
        },
        {
            key: 'activity',
            icon: faBell,
            value: '5',
            label: { en: 'Recent Activity', ar: 'النشاط الأخير' },
            note: { en: 'Today', ar: 'اليوم' },
            wrapperClass: 'bell',
        },
    ];
};

const projectCards = [
    {
        key: 'reports',
        icon: faFolder,
        iconStyles: { backgroundColor: '#e6f7ff', color: '#1890ff' },
        title: { en: 'Sales & Profit', ar: 'المبيعات والأرباح' },
        description: {
            en: 'Overview of your sales performance and profit over time.',
            ar: 'نظرة على أداء المبيعات والأرباح عبر الزمن.',
        },
        deadline: { en: 'Updated from latest sales', ar: 'محدَّثة من أحدث المبيعات' },
        progress: { value: '65%', labelColor: '#52c41a' },
        fillColor: '#52c41a',
        fillWidth: '65%',
        avatars: [
            { label: 'JD', background: '#f56a00' },
            { label: 'AM', background: '#7265e6' },
            { label: '+3', background: '#ff4d4f' },
        ],
    },
    {
        key: 'supplier',
        icon: faMobile,
        iconStyles: { backgroundColor: '#f6ffed', color: '#52c41a' },
        title: { en: 'Purchases & Stock', ar: 'المشتريات والمخزون' },
        description: {
            en: 'Track purchases from suppliers and their impact on stock.',
            ar: 'تتبع المشتريات من الموردين وتأثيرها على المخزون.',
        },
        deadline: { en: 'Updated from latest purchases', ar: 'محدَّثة من أحدث المشتريات' },
        progress: { value: '45%', labelColor: '#1890ff' },
        fillColor: '#1890ff',
        fillWidth: '45%',
        avatars: [
            { label: 'TS', background: '#1890ff' },
            { label: '+2', background: '#722ed1' },
        ],
    },
];

const actionButtons = [
    {
        key: 'sell',
        label: { en: 'Sell to Customer', ar: 'بيع للعميل' },
        type: 'primary',
        route: '/sell-to-customer',
    },
    {
        key: 'buy',
        label: { en: 'Buy From Supplier', ar: 'الشراء من المورد' },
        type: 'secondary',
        route: '/buy-from-supplier',
    },
];

const modulesTableColumns = [
    { key: 'section', label: { en: 'Section', ar: 'القسم' } },
    { key: 'description', label: { en: 'Description', ar: 'الوصف' } },
    { key: 'open', label: { en: 'Open', ar: 'فتح' } },
];

const modulesTableRows = [
    {
        key: 'products',
        name: { en: 'Products', ar: 'المنتجات' },
        description: {
            en: 'Manage your product catalog, prices and barcodes.',
            ar: 'إدارة قائمة المنتجات والأسعار والباركود.',
        },
        route: '/projects',
    },
    {
        key: 'stock',
        name: { en: 'Stock Batches', ar: 'دفعات المخزون' },
        description: {
            en: 'Track batch quantities and expiry dates.',
            ar: 'متابعة كميات الدُفعات وتواريخ الانتهاء.',
        },
        route: '/stock',
    },
    {
        key: 'customers',
        name: { en: 'Customers', ar: 'العملاء' },
        description: {
            en: 'Store customer details for faster sales.',
            ar: 'حفظ بيانات العملاء لتسريع عمليات البيع.',
        },
        route: '/customers',
    },
    {
        key: 'suppliers',
        name: { en: 'Suppliers', ar: 'الموردون' },
        description: {
            en: 'Manage your suppliers and purchase terms.',
            ar: 'إدارة الموردين وشروط الشراء.',
        },
        route: '/suppliers',
    },
    {
        key: 'salesHistory',
        name: { en: 'Sales History', ar: 'سجل المبيعات' },
        description: {
            en: 'Review previous customer bills and totals.',
            ar: 'مراجعة فواتير المبيعات السابقة والإجماليات.',
        },
        route: '/sales-history',
    },
    {
        key: 'purchasesHistory',
        name: { en: 'Purchases History', ar: 'سجل المشتريات' },
        description: {
            en: 'Review purchase bills and supplier costs.',
            ar: 'مراجعة فواتير المشتريات وتكاليف الموردين.',
        },
        route: '/purchases-history',
    },
    {
        key: 'returns',
        name: { en: 'Returns', ar: 'المرتجعات' },
        description: {
            en: 'Handle returned items and stock adjustments.',
            ar: 'التعامل مع المرتجعات وتعديلات المخزون.',
        },
        route: '/returns',
    },
];

const getSummaryCards = (language, entityCounts, countsLoading, countsError) => {
    const formatCount = (value) => {
        if (countsLoading) {
            return language === 'ar' ? '...جارٍ التحميل' : 'Loading...';
        }
        if (countsError) {
            return language === 'ar' ? 'خطأ' : 'Error';
        }
        return String(value ?? 0);
    };

    const totalContacts = (entityCounts.customers || 0) + (entityCounts.suppliers || 0);

    return [
        {
            key: 'products',
            icon: faFolder,
            className: 'blue',
            title: { en: 'Total Products', ar: 'إجمالي المنتجات' },
            value: formatCount(entityCounts.products),
            note: { en: 'From products list', ar: 'من قائمة المنتجات' },
            color: '#2563eb',
        },
        {
            key: 'batches',
            icon: faClock,
            className: 'green',
            title: { en: 'Stock Batches', ar: 'دفعات المخزون' },
            value: formatCount(entityCounts.stockBatches),
            note: { en: 'Tracked in stock', ar: 'متابعة في المخزون' },
            color: '#16a34a',
        },
        {
            key: 'contacts',
            icon: faUser,
            className: 'purple',
            title: { en: 'Customers & Suppliers', ar: 'العملاء والموردون' },
            value: formatCount(totalContacts),
            note: { en: 'Total contacts', ar: 'إجمالي جهات الاتصال' },
            color: '#8b5cf6',
        },
    ];
};

export default function Overview({ isAuthenticated, onLogout }) {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [profitStats, setProfitStats] = useState({ totalRevenue: 0, totalCost: 0, netProfit: 0 });
    const [profitLoading, setProfitLoading] = useState(false);
    const [profitError, setProfitError] = useState(null);
    const [entityCounts, setEntityCounts] = useState({
        products: 0,
        customers: 0,
        suppliers: 0,
        stockBatches: 0,
    });
    const [countsLoading, setCountsLoading] = useState(false);
    const [countsError, setCountsError] = useState(null);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    const [monthlyError, setMonthlyError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchProfitStats = async () => {
            try {
                setProfitLoading(true);
                const res = await fetch('http://localhost:3000/api/stats/profit', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch profit stats');
                const data = await res.json();
                setProfitStats({
                    totalRevenue: data.totalRevenue || 0,
                    totalCost: data.totalCost || 0,
                    netProfit: data.netProfit || 0,
                });
                setProfitError(null);
            } catch (err) {
                console.error(err);
                setProfitError(err.message || 'Failed to load profit stats');
            } finally {
                setProfitLoading(false);
            }
        };

        const fetchCounts = async () => {
            try {
                setCountsLoading(true);
                const headers = { 'Authorization': `Bearer ${token}` };
                const [productsRes, customersRes, suppliersRes, stockRes] = await Promise.all([
                    fetch('http://localhost:3000/api/products/list', { headers }),
                    fetch('http://localhost:3000/api/customers/list', { headers }),
                    fetch('http://localhost:3000/api/suppliers/list', { headers }),
                    fetch('http://localhost:3000/api/stock/batches/list', { headers }),
                ]);

                if (!productsRes.ok || !customersRes.ok || !suppliersRes.ok || !stockRes.ok) {
                    throw new Error('Failed to fetch overview counts');
                }

                const [products, customers, suppliers, stockBatches] = await Promise.all([
                    productsRes.json(),
                    customersRes.json(),
                    suppliersRes.json(),
                    stockRes.json(),
                ]);

                setEntityCounts({
                    products: Array.isArray(products) ? products.length : 0,
                    customers: Array.isArray(customers) ? customers.length : 0,
                    suppliers: Array.isArray(suppliers) ? suppliers.length : 0,
                    stockBatches: Array.isArray(stockBatches) ? stockBatches.length : 0,
                });
                setCountsError(null);
            } catch (err) {
                console.error(err);
                setCountsError(err.message || 'Failed to load overview counts');
            } finally {
                setCountsLoading(false);
            }
        };

        const fetchMonthlyStats = async () => {
            try {
                setMonthlyLoading(true);
                const res = await fetch('http://localhost:3000/api/stats/monthly-profit?months=6', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch monthly profit stats');
                const data = await res.json();
                setMonthlyStats(Array.isArray(data) ? data : []);
                setMonthlyError(null);
            } catch (err) {
                console.error(err);
                setMonthlyError(err.message || 'Failed to load monthly profit stats');
            } finally {
                setMonthlyLoading(false);
            }
        };

        fetchProfitStats();
        fetchCounts();
        fetchMonthlyStats();
    }, []);

    const statsCards = getStatsCards(language, profitStats, profitLoading, profitError);
    const summaryCards = getSummaryCards(language, entityCounts, countsLoading, countsError);
    const greetings =
        language === 'ar'
            ? <>مرحباً بعودتك، <span className={style.highlight}>Zeiad</span>! 👋</>
            : <>Welcome back, <span className={style.highlight}>Zeiad</span>! 👋</>;
    const welcomeSubtitle =
        language === 'ar'
            ? 'تابع وأدر وأكمل عمليات إدارة المخزون لديك.'
            : 'Track, manage and complete your stock management.';

    return (
        <div className={style.overviewContainer}>
            <Header
                name={language === 'ar' ? 'نظرة عامة على لوحة التحكم' : 'Dashboard Overview'}
                isAuthenticated={isAuthenticated}
                onLogout={onLogout}
            />

            <div className={style.welcomeSection}>
                <h1>{greetings}</h1>
                <p>{welcomeSubtitle}</p>
                <div className={style.cardContainer}>
                    {statsCards.map((stat) => (
                        <div key={stat.key} className={style.statsCard}>
                            <div className={`${style.statsIcon} ${style[stat.wrapperClass] || ''}`}>
                                <FontAwesomeIcon icon={stat.icon} />
                    </div>
                    <div className={style.statsContent}>
                                <div className={style.statsNumber}>{stat.value}</div>
                                <div className={style.statsLabel}>{stat.label[language]}</div>
                                <h5 className={style[stat.wrapperClass] || ''}>{stat.note[language]}</h5>
                    </div>
                </div>
                    ))}
                </div>

                <div className={style.actionButtons}>
                    {actionButtons.map((btn) => (
                        <button
                            key={btn.key}
                            className={`${style.btn} ${btn.type === 'primary' ? style.primaryBtn : style.secondaryBtn}`}
                            onClick={() => btn.route && navigate(btn.route)}
                        >
                            {btn.type === 'primary' && <FontAwesomeIcon icon={faPlus} />}
                            {btn.label[language]}
                    </button>
                    ))}
                </div>
            </div>

            <div className={style.projectsHeader}>
                <h3>{language === 'ar' ? 'نظرة عامة على النظام' : 'System Overview'}</h3>
                <a href="#" className={style.viewAllLink}>
                    {language === 'ar' ? 'عرض الكل' : 'View All'} <FontAwesomeIcon icon={faChevronRight} />
                </a>
            </div>

            <section className={style.projectSection}>
                <div className={style.projectGrid}>
                    {projectCards.map((card) => (
                        <div key={card.key} className={style.projectCard}>
                        <div className={style.projectHeader}>
                                <div className={style.projectIcon} style={{ backgroundColor: card.iconStyles.backgroundColor }}>
                                    <FontAwesomeIcon icon={card.icon} style={{ color: card.iconStyles.color }} />
                            </div>
                            <div className={style.projectActions}>
                                <button className={style.actionButton}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            </div>
                        </div>
                            <h4 className={style.projectTitle}>{card.title[language]}</h4>
                        <p className={style.projectDescription}>
                                {card.description[language]}
                        </p>
                        <div className={style.projectMeta}>
                                <span className={style.deadline}>{card.deadline[language]}</span>
                                <span className={style.progress} style={{ color: card.progress.labelColor }}>
                                    {card.progress.value} {language === 'ar' ? 'مكتمل' : 'Complete'}
                                </span>
                        </div>
                        <div className={style.progressBar}>
                                <div className={style.progressFill} style={{ width: card.fillWidth, backgroundColor: card.fillColor }}></div>
                            </div>
                            <div className={style.teamMembers}>
                                {card.avatars.map((avatar) => (
                                    <div key={avatar.label} className={style.avatar} style={{ backgroundColor: avatar.background }}>
                                        {avatar.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={style.chartSection}>
                <div>
                    <MonthlyEarnings
                        data={monthlyStats}
                        loading={monthlyLoading}
                        error={monthlyError}
                    />
                </div>
                <div>
                    <TaskDistribution
                        data={monthlyStats}
                        loading={monthlyLoading}
                        error={monthlyError}
                    />
                </div>
            </section>

            <section className={style.currentProjects}>
    <div className={style.projectsHeader}>
                    <h3>{language === 'ar' ? 'الوحدات النشطة' : 'Active Modules'}</h3>
        <button className={style.newProjectBtn}>
                        <FontAwesomeIcon icon={faPlus} /> {language === 'ar' ? 'وحدة جديدة' : 'New Module'}
        </button>
    </div>

    <table className={style.projectsTable}>
        <thead>
        <tr>
                            {modulesTableColumns.map((column) => (
                                <th key={column.key}>{column.label[language]}</th>
                            ))}
            </tr>
        </thead>
        <tbody>
                        {modulesTableRows.map((row) => (
                            <tr key={row.key}>
                <td>
                    <div className={style.projectInfo}>
                                        <div className={style.projectName}>{row.name[language]}</div>
                    </div>
                </td>
                <td>
                    <div className={style.projectDesc}>{row.description[language]}</div>
                </td>
                <td className={style.actions}>
                    <button
                        type="button"
                        className={style.newProjectBtn}
                        onClick={() => navigate(row.route)}
                    >
                        {language === 'ar' ? 'الانتقال' : 'Go'}
                    </button>
                </td>
            </tr>
                        ))}
        </tbody>
    </table>
</section>

<section className={style.summaryStats}>
                {summaryCards.map((card) => (
                    <div key={card.key} className={style.summaryCard}>
                        <div className={`${style.iconWrapper} ${style[card.className]}`}>
                            <FontAwesomeIcon icon={card.icon} />
        </div>
                        <h4 className={style.summaryTitle}>{card.title[language]}</h4>
                        <div className={style.summaryValue} style={{ color: card.color }}>{card.value}</div>
                        <p className={style.summaryNote}>{card.note[language]}</p>
    </div>
                ))}
</section>
        </div>
    );
}
// import React from 'react' 
// import style from './OverviewStyle.module.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import MonthlyEarnings from './OverviewChars/MonthlyEarning.jsx'
// import TaskDistribution from './OverviewChars/TaskDistribution.jsx'
// import { 
//     faBell, 
//     faUser, 
//     faFolder, 
//     faPlus, 
//     faChevronRight, 
//     faDollarSign, 
//     faClock, 
//     faEllipsisV, 
//     faMobile,
//     faStar 
// } from '@fortawesome/free-solid-svg-icons'
// import Header from './OverviewChars/Header.jsx'
// export default function Overview() {
//     return (
//         <div className={style.overviewContainer}>
//             <Header name="Dashboard Overview"/>

//             <div className={style.welcomeSection}>
//                 <h1>Welcome back, <span className={style.highlight}>Zeiad</span>! 👋</h1>
//                 <p>Track, manage and complete your stock management</p>
//                 <div className={style.cardContainer}>
//                 <div className={style.statsCard}>
//                     <div className={style.statsIcon}>
//                         <FontAwesomeIcon icon={faFolder} />
//                     </div>
//                     <div className={style.statsContent}>
//                         <div className={style.statsNumber}>12</div>
//                         <div className={style.statsLabel}>Total Sales</div>
//                         <h5>+2 this month</h5>
//                     </div>
//                 </div>
//                 <div className={style.statsCard}>
//                     <div className={`${style.statsIcon} ${style.dollar}`}>
//                         <FontAwesomeIcon icon={faDollarSign} className={style.dollar}/>
//                     </div>
//                     <div className={style.statsContent}>
//                         <div className={style.statsNumber}>$5,200</div>
//                         <div className={style.statsLabel}>Total Earnings</div>
//                         <h5 className={style.dollar}>+12 from last month</h5>
//                     </div>
//                 </div>
//                 <div className={style.statsCard}>
//                     <div className={`${style.statsIcon} ${style.clock}`}>
//                         <FontAwesomeIcon icon={faClock} />
//                     </div>
//                     <div className={style.statsContent}>
//                         <div className={style.statsNumber}>3</div>
//                         <div className={style.statsLabel}>Tasks Due</div>
//                         <h5 className={style.clock}>Due this week</h5>
//                     </div>
//                 </div>
//                 <div className={style.statsCard}>
//                     <div className={`${style.statsIcon} ${style.bell}`}>
//                         <FontAwesomeIcon icon={faBell} />
//                     </div>
//                     <div className={style.statsContent}>
//                         <div className={style.statsNumber}>5</div>
//                         <div className={style.statsLabel}>Recent Activity</div>
//                         <h5 className={style.bell}>Today</h5>
//                     </div>
//                 </div>
//                 </div>

//                 <div className={style.actionButtons}>
//                     <button className={`${style.btn} ${style.primaryBtn}`}>
//                         <FontAwesomeIcon icon={faPlus} /> Start a New Project
//                     </button>
//                     <button className={`${style.btn} ${style.secondaryBtn}`}>
//                         View All Projects
//                     </button>
//                 </div>
//             </div>

//             <div className={style.projectsHeader}>
//                 <h3>My Projects</h3>
//                 <a href="#" className={style.viewAllLink}>
//                     View All <FontAwesomeIcon icon={faChevronRight} />
//                 </a>
//             </div>



//             <section className={style.projectSection}>
//                 <div className={style.projectGrid}>
//                     {/* Project Card 1 */}
//                     <div className={style.projectCard}>
//                         <div className={style.projectHeader}>
//                             <div className={style.projectIcon} style={{ backgroundColor: '#e6f7ff' }}>
//                                 <FontAwesomeIcon icon={faFolder} style={{ color: '#1890ff' }} />
//                             </div>
//                             <div className={style.projectActions}>
//                                 <button className={style.actionButton}>
//                                     <FontAwesomeIcon icon={faEllipsisV} />
//                                 </button>
//                             </div>
//                         </div>
//                         <h4 className={style.projectTitle}>Reports</h4>
//                         <p className={style.projectDescription}>
//                            ...............................
//                         </p>
//                         <div className={style.projectMeta}>
//                             <span className={style.deadline}>Due: Aug 30, 2023</span>
//                             <span className={style.progress} style={{ color: '#52c41a' }}>65% Complete</span>
//                         </div>
//                         <div className={style.progressBar}>
//                             <div className={style.progressFill} style={{ width: '65%', backgroundColor: '#52c41a' }}></div>
//                         </div>
//                         <div className={style.teamMembers}>
//                             <div className={style.avatar} style={{ backgroundColor: '#f56a00' }}>JD</div>
//                             <div className={style.avatar} style={{ backgroundColor: '#7265e6' }}>AM</div>
//                             <div className={style.avatar} style={{ backgroundColor: '#ff4d4f' }}>+3</div>
//                         </div>
//                     </div>

//                     {/* Project Card 2 */}
//                     <div className={style.projectCard}>
//                         <div className={style.projectHeader}>
//                             <div className={style.projectIcon} style={{ backgroundColor: '#f6ffed' }}>
//                                 <FontAwesomeIcon icon={faMobile} style={{ color: '#52c41a' }} />
//                             </div>
//                             <div className={style.projectActions}>
//                                 <button className={style.actionButton}>
//                                     <FontAwesomeIcon icon={faEllipsisV} />
//                                 </button>
//                             </div>
//                         </div>
//                         <h4 className={style.projectTitle}>Buy From Supplier</h4>
//                         <p className={style.projectDescription}>
//                             ...............................
//                         </p>
//                         <div className={style.projectMeta}>
//                             <span className={style.deadline}>Due: Sep 15, 2023</span>
//                             <span className={style.progress} style={{ color: '#1890ff' }}>45% Complete</span>
//                         </div>
//                         <div className={style.progressBar}>
//                             <div className={style.progressFill} style={{ width: '45%', backgroundColor: '#1890ff' }}></div>
//                         </div>
//                         <div className={style.teamMembers}>
//                             <div className={style.avatar} style={{ backgroundColor: '#1890ff' }}>TS</div>
//                             <div className={style.avatar} style={{ backgroundColor: '#722ed1' }}>+2</div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <section className={style.chartSection}>
//                 <div><MonthlyEarnings /></div>
//                 <div><TaskDistribution /></div>
//             </section>



//             <section className={style.currentProjects}>
//     <div className={style.projectsHeader}>
//         <h3>Current Projects</h3>
//         <button className={style.newProjectBtn}>
//             <FontAwesomeIcon icon={faPlus} /> New Project
//         </button>
//     </div>

//     <table className={style.projectsTable}>
//         <thead>
//             <tr>
//                 <th>Project</th>
//                 <th>Client</th>
//                 <th>Status</th>
//                 <th>Progress</th>
//                 <th>Due Date</th>
//                 <th>Actions</th>
//             </tr>
//         </thead>
//         <tbody>
//             {/* Row 1 */}
//             <tr>
//                 <td>
//                     <div className={style.projectInfo}>
//                         <div className={style.projectName}>E-commerce Website</div>
//                         <div className={style.projectDesc}>Full stack development</div>
//                     </div>
//                 </td>
//                 <td>
//                     <div className={style.clientInfo}>
//                         <div>TechCorp Inc.</div>
//                         <small>tech@techcorp.com</small>
//                     </div>
//                 </td>
//                 <td><span className={`${style.status} ${style.inProgress}`}>In Progress</span></td>
//                 <td>
//                     <div className={style.progressWrapper}>
//                         <div className={style.progressBarTrack}>
//                             <div className={style.progressBarFill} style={{ width: "65%", backgroundColor: "#2563eb" }}></div>
//                         </div>
//                         <span>65%</span>
//                     </div>
//                 </td>
//                 <td>Mar 15, 2024</td>
//                 <td className={style.actions}>
//                     <FontAwesomeIcon icon={faChevronRight} className={style.actionIcon} />
//                     <FontAwesomeIcon icon={faEllipsisV} className={style.actionIcon} />
//                 </td>
//             </tr>

//             {/* Row 2 */}
//             <tr>
//                 <td>
//                     <div className={style.projectInfo}>
//                         <div className={style.projectName}>Brand Identity</div>
//                         <div className={style.projectDesc}>Logo and brand guidelines</div>
//                     </div>
//                 </td>
//                 <td>
//                     <div className={style.clientInfo}>
//                         <div>StartupXYZ</div>
//                         <small>hello@startupxyz.com</small>
//                     </div>
//                 </td>
//                 <td><span className={`${style.status} ${style.completed}`}>Completed</span></td>
//                 <td>
//                     <div className={style.progressWrapper}>
//                         <div className={style.progressBarTrack}>
//                             <div className={style.progressBarFill} style={{ width: "100%", backgroundColor: "#16a34a" }}></div>
//                         </div>
//                         <span>100%</span>
//                     </div>
//                 </td>
//                 <td>Feb 28, 2024</td>
//                 <td className={style.actions}>
//                     <FontAwesomeIcon icon={faChevronRight} className={style.actionIcon} />
//                     <FontAwesomeIcon icon={faEllipsisV} className={style.actionIcon} />
//                 </td>
//             </tr>

//             {/* Row 3 */}
//             <tr>
//                 <td>
//                     <div className={style.projectInfo}>
//                         <div className={style.projectName}>Mobile App Design</div>
//                         <div className={style.projectDesc}>UI/UX design for iOS app</div>
//                     </div>
//                 </td>
//                 <td>
//                     <div className={style.clientInfo}>
//                         <div>FinanceApp Ltd.</div>
//                         <small>contact@financeapp.com</small>
//                     </div>
//                 </td>
//                 <td><span className={`${style.status} ${style.review}`}>Review</span></td>
//                 <td>
//                     <div className={style.progressWrapper}>
//                         <div className={style.progressBarTrack}>
//                             <div className={style.progressBarFill} style={{ width: "85%", backgroundColor: "#d97706" }}></div>
//                         </div>
//                         <span>85%</span>
//                     </div>
//                 </td>
//                 <td>Mar 20, 2024</td>
//                 <td className={style.actions}>
//                     <FontAwesomeIcon icon={faChevronRight} className={style.actionIcon} />
//                     <FontAwesomeIcon icon={faEllipsisV} className={style.actionIcon} />
//                 </td>
//             </tr>
//         </tbody>
//     </table>
// </section>



// <section className={style.summaryStats}>
//     <div className={style.summaryCard}>
//         <div className={`${style.iconWrapper} ${style.blue}`}>
//             <FontAwesomeIcon icon={faClock} />
//         </div>
//         <h4 className={style.summaryTitle}>Hours This Month</h4>
//         <div className={style.summaryValue} style={{ color: "#2563eb" }}>142</div>
//         <p className={style.summaryNote}>+18 hours from last month</p>
//     </div>

//     <div className={style.summaryCard}>
//         <div className={`${style.iconWrapper} ${style.green}`}>
//             <FontAwesomeIcon icon={faUser} />
//         </div>
//         <h4 className={style.summaryTitle}>Active Clients</h4>
//         <div className={style.summaryValue} style={{ color: "#16a34a" }}>8</div>
//         <p className={style.summaryNote}>2 new clients this month</p>
//     </div>

//     <div className={style.summaryCard}>
//         <div className={`${style.iconWrapper} ${style.purple}`}>
//             <FontAwesomeIcon icon={faStar} />
//         </div>
//         <h4 className={style.summaryTitle}>Average Rating</h4>
//         <div className={style.summaryValue} style={{ color: "#8b5cf6" }}>4.9</div>
//         <p className={style.summaryNote}>Based on 24 reviews</p>
//     </div>
// </section>

//         </div>

        
//     )
// }