import React from 'react';
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

const statsCards = [
    {
        key: 'sales',
        icon: faFolder,
        value: '12',
        label: { en: 'Total Sales', ar: 'إجمالي المبيعات' },
        note: { en: '+2 this month', ar: '+2 هذا الشهر' },
        wrapperClass: '',
    },
    {
        key: 'earnings',
        icon: faDollarSign,
        value: '$5,200',
        label: { en: 'Total Earnings', ar: 'إجمالي الأرباح' },
        note: { en: '+12 from last month', ar: '+12 عن الشهر الماضي' },
        wrapperClass: 'dollar',
    },
    {
        key: 'tasks',
        icon: faClock,
        value: '3',
        label: { en: 'Tasks Due', ar: 'المهام المستحقة' },
        note: { en: 'Due this week', ar: 'مستحق هذا الأسبوع' },
        wrapperClass: 'clock',
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

const projectCards = [
    {
        key: 'reports',
        icon: faFolder,
        iconStyles: { backgroundColor: '#e6f7ff', color: '#1890ff' },
        title: { en: 'Reports', ar: 'التقارير' },
        description: {
            en: 'Automated weekly reports for inventory KPIs.',
            ar: 'تقارير أسبوعية آلية لمؤشرات أداء المخزون.',
        },
        deadline: { en: 'Due: Aug 30, 2023', ar: 'الموعد النهائي: 30 أغسطس 2023' },
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
        title: { en: 'Buy From Supplier', ar: 'الشراء من المورد' },
        description: {
            en: 'Track purchase orders and supplier fulfillment.',
            ar: 'تتبع أوامر الشراء وتنفيذ الموردين.',
        },
        deadline: { en: 'Due: Sep 15, 2023', ar: 'الموعد النهائي: 15 سبتمبر 2023' },
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
        key: 'newProject',
        label: { en: 'Start a New Project', ar: 'ابدأ مشروعًا جديدًا' },
        type: 'primary',
    },
    {
        key: 'viewProjects',
        label: { en: 'View All Projects', ar: 'عرض جميع المشاريع' },
        type: 'secondary',
    },
];

const projectTableColumns = [
    { key: 'project', label: { en: 'Project', ar: 'المشروع' } },
    { key: 'client', label: { en: 'Client', ar: 'العميل' } },
    { key: 'status', label: { en: 'Status', ar: 'الحالة' } },
    { key: 'progress', label: { en: 'Progress', ar: 'التقدم' } },
    { key: 'dueDate', label: { en: 'Due Date', ar: 'تاريخ الاستحقاق' } },
    { key: 'actions', label: { en: 'Actions', ar: 'الإجراءات' } },
];

const projectTableRows = [
    {
        key: 'ecommerce',
        project: {
            name: { en: 'E-commerce Website', ar: 'موقع تجارة إلكترونية' },
            desc: { en: 'Full stack development', ar: 'تطوير متكامل' },
        },
        client: { name: 'TechCorp Inc.', email: 'tech@techcorp.com' },
        status: { label: { en: 'In Progress', ar: 'قيد التنفيذ' }, className: 'inProgress' },
        progress: '65%',
        progressColor: '#2563eb',
        dueDate: { en: 'Mar 15, 2024', ar: '15 مارس 2024' },
    },
    {
        key: 'brand',
        project: {
            name: { en: 'Brand Identity', ar: 'هوية العلامة' },
            desc: { en: 'Logo and brand guidelines', ar: 'شعار ودليل هوية' },
        },
        client: { name: 'StartupXYZ', email: 'hello@startupxyz.com' },
        status: { label: { en: 'Completed', ar: 'مكتمل' }, className: 'completed' },
        progress: '100%',
        progressColor: '#16a34a',
        dueDate: { en: 'Feb 28, 2024', ar: '28 فبراير 2024' },
    },
    {
        key: 'mobileApp',
        project: {
            name: { en: 'Mobile App Design', ar: 'تصميم تطبيق جوال' },
            desc: { en: 'UI/UX design for iOS app', ar: 'تصميم واجهات لتطبيق iOS' },
        },
        client: { name: 'FinanceApp Ltd.', email: 'contact@financeapp.com' },
        status: { label: { en: 'Review', ar: 'قيد المراجعة' }, className: 'review' },
        progress: '85%',
        progressColor: '#d97706',
        dueDate: { en: 'Mar 20, 2024', ar: '20 مارس 2024' },
    },
];

const summaryCards = [
    {
        key: 'hours',
        icon: faClock,
        className: 'blue',
        title: { en: 'Hours This Month', ar: 'ساعات هذا الشهر' },
        value: '142',
        note: { en: '+18 hours from last month', ar: '+18 ساعة عن الشهر الماضي' },
        color: '#2563eb',
    },
    {
        key: 'clients',
        icon: faUser,
        className: 'green',
        title: { en: 'Active Clients', ar: 'العملاء النشطون' },
        value: '8',
        note: { en: '2 new clients this month', ar: 'عميلان جديدان هذا الشهر' },
        color: '#16a34a',
    },
    {
        key: 'rating',
        icon: faStar,
        className: 'purple',
        title: { en: 'Average Rating', ar: 'متوسط التقييم' },
        value: '4.9',
        note: { en: 'Based on 24 reviews', ar: 'استنادًا إلى 24 مراجعة' },
        color: '#8b5cf6',
    },
];

export default function Overview() {
    const { language } = useLanguage();
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
            <Header name={language === 'ar' ? 'نظرة عامة على لوحة التحكم' : 'Dashboard Overview'} />

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
                        >
                            {btn.type === 'primary' && <FontAwesomeIcon icon={faPlus} />}
                            {btn.label[language]}
                    </button>
                    ))}
                </div>
            </div>

            <div className={style.projectsHeader}>
                <h3>{language === 'ar' ? 'مشاريعي' : 'My Projects'}</h3>
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
                <div><MonthlyEarnings /></div>
                <div><TaskDistribution /></div>
            </section>

            <section className={style.currentProjects}>
    <div className={style.projectsHeader}>
                    <h3>{language === 'ar' ? 'المشاريع الحالية' : 'Current Projects'}</h3>
        <button className={style.newProjectBtn}>
                        <FontAwesomeIcon icon={faPlus} /> {language === 'ar' ? 'مشروع جديد' : 'New Project'}
        </button>
    </div>

    <table className={style.projectsTable}>
        <thead>
            <tr>
                            {projectTableColumns.map((column) => (
                                <th key={column.key}>{column.label[language]}</th>
                            ))}
            </tr>
        </thead>
        <tbody>
                        {projectTableRows.map((row) => (
                            <tr key={row.key}>
                <td>
                    <div className={style.projectInfo}>
                                        <div className={style.projectName}>{row.project.name[language]}</div>
                                        <div className={style.projectDesc}>{row.project.desc[language]}</div>
                    </div>
                </td>
                <td>
                    <div className={style.clientInfo}>
                                        <div>{row.client.name}</div>
                                        <small>{row.client.email}</small>
                    </div>
                </td>
                                <td><span className={`${style.status} ${style[row.status.className]}`}>{row.status.label[language]}</span></td>
                <td>
                    <div className={style.progressWrapper}>
                        <div className={style.progressBarTrack}>
                                            <div className={style.progressBarFill} style={{ width: row.progress, backgroundColor: row.progressColor }}></div>
                        </div>
                                        <span>{row.progress}</span>
                    </div>
                </td>
                                <td>{row.dueDate[language]}</td>
                <td className={style.actions}>
                    <FontAwesomeIcon icon={faChevronRight} className={style.actionIcon} />
                    <FontAwesomeIcon icon={faEllipsisV} className={style.actionIcon} />
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