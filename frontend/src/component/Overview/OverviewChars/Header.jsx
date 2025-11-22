import React from 'react'
import style from '../OverviewStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUser, faFolder, faPlus, faChevronRight, faDollarSign, faClock, faEllipsisV, faMobile, faStar } from '@fortawesome/free-solid-svg-icons'

export default function Header({name}) {
    return (
        <div className={style.header}>
            <h2 className={style.title}>{name}</h2>
            <div className={style.headerActions}>
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