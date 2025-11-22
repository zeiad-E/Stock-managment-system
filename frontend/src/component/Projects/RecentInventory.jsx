import React, { useState, useEffect } from "react";
import "./RecentInventory.css";  // Renamed CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faExclamationTriangle, faCheckCircle, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const RecentInventory = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [lowStock, setLowStock] = useState(0);
    const [expiringSoon, setExpiringSoon] = useState(0);

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

    return (
        <div className="dashboard-container">
            {/* Summary Section */}
            <div className="summary-container">
                <div className="summary-card">
                    <div className="summary-header">
                        <span className="summary-title">Total Products</span>
                        <FontAwesomeIcon icon={faBox} className="summary-icon" />
                    </div>
                    <div className="summary-value">{totalProducts}</div>
                    <div className="summary-status">↑ +2 this month</div>  {/* Static; update if needed */}
                </div>

                <div className="summary-card">
                    <div className="summary-header">
                        <span className="summary-title">Low Stock</span>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="summary-icon" />
                    </div>
                    <div className="summary-value">{lowStock}</div>
                    <div className="summary-status in-progress">● Below threshold</div>
                </div>

                <div className="summary-card">
                    <div className="summary-header">
                        <span className="summary-title">Expiring Soon</span>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="summary-icon" />
                    </div>
                    <div className="summary-value">{expiringSoon}</div>
                    <div className="summary-status">Within 30 days</div>
                </div>

                <div className="summary-card">
                    <div className="summary-header">
                        <span className="summary-title">Total Value</span>
                        <FontAwesomeIcon icon={faDollarSign} className="summary-icon" />
                    </div>
                    <div className="summary-value">$??K</div>  {/* Placeholder; calculate from API if needed */}
                    <div className="summary-status success">↑ +12% from last month</div>
                </div>
            </div>

            {/* Recent Activities - Kept similar, adapt to inventory if more APIs */}
            <div className="activities-container">
                <h3 className="activities-header">Recent Inventory Activities</h3>

                <div className="activity-item">
                    <div className="activity-icon blue"><FontAwesomeIcon icon={faBox} /></div>
                    <div className="activity-content">
                        <div className="activity-title">
                            New product added: <span className="highlight">Super Chips</span>
                        </div>
                        <div className="activity-subtext">Added by admin</div>
                        <div className="activity-time">2 hours ago</div>
                    </div>
                </div>

                {/* Add more or fetch real activities if API exists */}
                {/* ... similar for others */}
            </div>
        </div>
    );
};

export default RecentInventory;