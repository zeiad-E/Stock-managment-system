import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import style from './MenuStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faBox, 
  faWarehouse, 
  faTruck, 
  faUsers, 
  faUser, 
  faCartShopping, 
  faCashRegister, 
  faArrowRotateLeft,
  faBars,
  faTimes,
  faPlus,
  faCalendar,
  faChartColumn
} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';

const getInitialMenuState = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth > 768;
  }
  return true;
};

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(getInitialMenuState);
  const { language } = useLanguage();
  
  // 1. Create a ref for the Hamburger button too
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null); 

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // 2. Check if the click is NOT inside the Menu AND NOT inside the Hamburger button
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current && 
        !hamburgerRef.current.contains(event.target)
      ) {
        if (window.innerWidth <= 768) {
          setIsMenuOpen(false);
        }
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sidebarElement = menuRef.current?.closest('.sidebar');
    if (!sidebarElement) return;

    if (isMenuOpen) {
      sidebarElement.classList.remove('sidebarCollapsed');
    } else {
      sidebarElement.classList.add('sidebarCollapsed');
    }
  }, [isMenuOpen]);

  const labels = {
    en: {
      title: 'Stock Management System',
      mainNav: 'MAIN NAVIGATION',
      quickActions: 'QUICK ACTION',
      quickItems: {
        newProject: 'New Project',
        schedule: 'Schedule',
        analytics: 'Analytics',
      },
      items: {
        overview: 'Overview',
        products: 'Products',
        stock: 'Stock',
        suppliers: 'Suppliers',
        customers: 'Customers',
        profile: 'Profile Setting',
        buy: 'Buy From Supplier',
        sell: 'Sell To Customer',
        returns: 'Returns',
        salesHistory: 'Sales History',
        purchasesHistory: 'Purchases History',
      },
    },
    ar: {
      title: 'نظام إدارة المخزون',
      mainNav: 'التنقل الرئيسي',
      quickActions: 'إجراءات سريعة',
      quickItems: {
        newProject: 'مشروع جديد',
        schedule: 'الجدول الزمني',
        analytics: 'التحليلات',
      },
      items: {
        overview: 'نظرة عامة',
        products: 'المنتجات',
        stock: 'المخزون',
        suppliers: 'الموردون',
        customers: 'العملاء',
        profile: 'إعدادات الحساب',
        buy: 'الشراء من المورد',
        sell: 'البيع للعميل',
        returns: 'المرتجعات',
        salesHistory: 'سجل المبيعات',
        purchasesHistory: 'سجل المشتريات',
      },
    },
  };

  const t = labels[language];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { to: '/', icon: faHouse, label: t.items.overview },
    { to: '/projects', icon: faBox, label: t.items.products },
    { to: '/stock', icon: faWarehouse, label: t.items.stock },
    { to: '/suppliers', icon: faTruck, label: t.items.suppliers },
    { to: '/customers', icon: faUsers, label: t.items.customers },
    { to: '/settings', icon: faUser, label: t.items.profile },
    { to: '/buy-from-supplier', icon: faCartShopping, label: t.items.buy },
    { to: '/sell-to-customer', icon: faCashRegister, label: t.items.sell },
    { to: '/returns', icon: faArrowRotateLeft, label: t.items.returns },
    { to: '/sales-history', icon: faArrowRotateLeft, label: t.items.salesHistory },
    { to: '/purchases-history', icon: faArrowRotateLeft, label: t.items.purchasesHistory },
  ];

  const quickItems = [
    { icon: faPlus, label: t.quickItems.newProject },
    { icon: faCalendar, label: t.quickItems.schedule },
    { icon: faChartColumn, label: t.quickItems.analytics },
  ];

  const menuClasses = [
    style.menu,
    language === 'ar' ? style.menuRtl : '',
    isMenuOpen ? style.menuOpen : style.menuCollapsed,
  ]
    .filter(Boolean)
    .join(' ');

  const hamburgerPosition =
    language === 'ar'
      ? { left: '20px', right: 'auto' } 
      : { left: 'auto', right: '20px' };

  return (
    <>
      <div
        ref={hamburgerRef} /* 3. Attach the ref to the hamburger div */
        className={style.hamburger}
        onClick={toggleMenu}
        style={hamburgerPosition}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
      >
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
      </div>
      
      <div ref={menuRef} className={menuClasses}>
        <div className={style.menuContent}>
          <h1 className={style.title}>{t.title}</h1>
          <hr />
          <h4>{t.mainNav}</h4>

          <div className={style.mainNavigation}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? `${style.menuItem} ${style.active}` : style.menuItem)}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  style={
                    language === 'ar'
                      ? { paddingLeft: '10px' }
                      : { paddingRight: '10px' }
                  }
                />
                {item.label}
              </NavLink>
            ))}
          </div>

          <h4>{t.quickActions}</h4>
          <div className={style.quickAction}>
            <ul>
              {quickItems.map((item) => (
                <li key={item.label}>
                  <FontAwesomeIcon icon={item.icon} />  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};