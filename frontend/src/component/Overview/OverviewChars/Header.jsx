import React from 'react'
import style from '../OverviewStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../../../context/LanguageContext'

export default function Header({ name, isAuthenticated, onLogout }) {
    const { language, toggleLanguage } = useLanguage()
    const switchLabel = language === 'en' ? 'العربية' : 'English'
    const statusLabel = isAuthenticated
        ? (language === 'ar' ? 'الحالة: مسجل الدخول' : 'Status: Logged in')
        : (language === 'ar' ? 'الحالة: غير مسجل' : 'Status: Logged out')
    const logoutLabel = language === 'ar' ? 'تسجيل الخروج' : 'Logout'

    return (
        <div className={style.header}>
            <div className={style.brandWrapper}>
                <div className={style.logoBadge}>G3</div>
                <div className={style.siteName}>Geek3</div>
                <h2 className={style.title}>{name}</h2>
            </div>
            <div className={style.headerActions}>
                <span className={style.authStatus}>{statusLabel}</span>
                <button 
                    type="button" 
                    className={style.languageSwitch} 
                    onClick={toggleLanguage}
                    aria-pressed={language === 'ar'}
                >
                    {switchLabel}
                </button>
                {isAuthenticated && (
                    <button
                        type="button"
                        className={style.logoutButton}
                        onClick={onLogout}
                    >
                        {logoutLabel}
                    </button>
                )}
                <div className={style.notification}>
                    <FontAwesomeIcon icon={faBell} />
                    <span className={style.badge}>5</span>
                </div>
                <div className={style.userIcon}>
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
        </div>
    )
}