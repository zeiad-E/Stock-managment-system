import React from 'react'
import style from '../OverviewStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons'
import { useLanguage } from '../../../context/LanguageContext'

export default function Header({name}) {
    const { language, toggleLanguage } = useLanguage()
    const switchLabel = language === 'en' ? 'العربية' : 'English'
    return (
        <div className={style.header}>
            <div className={style.brandWrapper}>
                <div className={style.logoBadge}>G3</div>
                <div className={style.siteName}>Geek3</div>
                <h2 className={style.title}>{name}</h2>
            </div>
            <div className={style.headerActions}>
                <button 
                    type="button" 
                    className={style.languageSwitch} 
                    onClick={toggleLanguage}
                    aria-pressed={language === 'ar'}
                >
                    {switchLabel}
                </button>
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