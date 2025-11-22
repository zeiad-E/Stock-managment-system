import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import style from './MenuStyle.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faUser, 
  faPlus, 
  faCalendar, 
  faChartSimple, 
  faBars, 
  faBox, 
  faWarehouse, 
  faTruck, 
  faUsers, 
  faCartShopping, 
  faCashRegister, 
  faArrowRotateLeft 
} from '@fortawesome/free-solid-svg-icons';
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
            <NavLink to='/' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faHouse} style={{paddingRight: '10px'}}/> Overview
            </NavLink>
            <NavLink to='/Projects' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faBox} style={{paddingRight: '10px'}}/> Products
            </NavLink>
            <NavLink to='/stock' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faWarehouse} style={{paddingRight: '10px'}}/> Stock
            </NavLink>
            <NavLink to='/suppliers' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faTruck} style={{paddingRight: '10px'}}/>   Suppliers
            </NavLink>
            <NavLink to='/customers' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faUsers} style={{paddingRight: '10px'}}/>   Customers
            </NavLink>
            <NavLink to='/settings' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faUser} style={{paddingRight: '10px'}}/>   Profile Setting
            </NavLink>
            <NavLink to='/buy-from-supplier' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faCartShopping} style={{paddingRight: '10px'}}/>   Buy From Supplier
            </NavLink>
            <NavLink to='/sell-to-customer' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faCashRegister} style={{paddingRight: '10px'}}/>   Sell To Customer
            </NavLink>
            <NavLink to='/returns' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faArrowRotateLeft} style={{paddingRight: '10px'}}/>   Returns
            </NavLink>
            <NavLink to='/sales-history' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faArrowRotateLeft} style={{paddingRight: '10px'}}/>   Sales History
            </NavLink>
            <NavLink to='/purchases-history' className={({ isActive }) => isActive ? `${style.menuItem} ${style.active}` : style.menuItem}>
              <FontAwesomeIcon icon={faArrowRotateLeft} style={{paddingRight: '10px'}}/>   Purchases History
            </NavLink>
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
