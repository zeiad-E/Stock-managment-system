import React from "react";
import "./RecentSuppliers.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faUserCheck, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const RecentSuppliers = ({ suppliersCount }) => {
    return (
        <div className="dashboard-container">
            {/* Summary Section */}
            <div className="summary-container">
                <div className="summary-card">
                    <div className="summary-header">
                        <span className="summary-title">Total Suppliers</span>
                        <FontAwesomeIcon icon={faBuilding} className="summary-icon" />
                    </div>
                    <div className="summary-value">{suppliersCount}</div>
                    <div className="summary-status">↑ +1 this month</div>  {/* Static; update if needed */}
                </div>

                <div className="summary-card">
                    <div className="summary-header">
                        <span className="summary-title">Active Suppliers</span>
                        <FontAwesomeIcon icon={faUserCheck} className="summary-icon" />
                    </div>
                    <div className="summary-value">{Math.round(suppliersCount * 0.8)}</div>  {/* Placeholder */}
                    <div className="summary-status in-progress">● Currently active</div>
                </div>

                <div className="summary-card">
                    <div className="summary-header">
                        <span className="summary-title">Total Spend</span>
                        <FontAwesomeIcon icon={faDollarSign} className="summary-icon" />
                    </div>
                    <div className="summary-value">$??K</div>  {/* Placeholder; compute if API available */}
                    <div className="summary-status success">↑ +10% from last month</div>
                </div>
            </div>

            {/* Recent Activities - Static examples */}
            <div className="activities-container">
                <h3 className="activities-header">Recent Supplier Activities</h3>

                <div className="activity-item">
                    <div className="activity-icon blue"><FontAwesomeIcon icon={faBuilding} /></div>
                    <div className="activity-content">
                        <div className="activity-title">
                            New supplier added: <span className="highlight">Golden Foods Co.</span>
                        </div>
                        <div className="activity-subtext">Added by admin</div>
                        <div className="activity-time">2 hours ago</div>
                    </div>
                </div>

                <div className="activity-item">
                    <div className="activity-icon green">✅</div>
                    <div className="activity-content">
                        <div className="activity-title">
                            Supplier updated: <span className="highlight">Supplier XYZ</span>
                        </div>
                        <div className="activity-subtext">Contact details changed</div>
                        <div className="activity-time">5 hours ago</div>
                    </div>
                </div>

                <div className="activity-item">
                    <div className="activity-icon red">❌</div>
                    <div className="activity-content">
                        <div className="activity-title">
                            Supplier deleted: <span className="highlight">Old Supplier</span>
                        </div>
                        <div className="activity-subtext">Removed by admin</div>
                        <div className="activity-time">2 days ago</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentSuppliers;