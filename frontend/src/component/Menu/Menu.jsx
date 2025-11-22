import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import style from './MenuStyle.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse , faFolder , faUser , faPlus , faCalendar , faChartSimple, faBars } from '@fortawesome/free-solid-svg-icons';
export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button className={style.hamburger} onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className={`${style.menu} ${isMenuOpen ? style.menuOpen : ''}`}>

        <h2 className={style.title}>Freelance Dashboard</h2>
        <hr />
        <h4>MAIN NAVIGATION</h4>

        <div className={style.mainNavigation}>
            <NavLink to='/' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}><FontAwesomeIcon icon={faHouse} />  Overview</NavLink>
            <NavLink to='/Projects' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}><FontAwesomeIcon icon={faFolder} />   Products</NavLink>
            <NavLink to='/suppliers' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}><FontAwesomeIcon icon={faFolder} />   Suppliers</NavLink>
            <NavLink to='/customers' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}><FontAwesomeIcon icon={faFolder} />   Customers</NavLink>
            <NavLink to='/settings' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}><FontAwesomeIcon icon={faUser} />  Profile Setting</NavLink>
        </div>

            <h4>QUICK ACTION</h4>
        <div className={style.quickAction}>
            <ul>
                <li><FontAwesomeIcon icon={faPlus} />  New Project</li>
                <li><FontAwesomeIcon icon={faCalendar} />  Schedule</li>
                <li><FontAwesomeIcon icon={faChartSimple} />  Analytics</li>
            </ul>
        </div>
    </div>

    </>
  )
}
