import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './SalesHistoryStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort, faEye } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';  // Assume this is unchanged

const SalesHistory = () => {
    const [salesData, setSalesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/customer-bills/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSalesData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredSales = salesData.filter(sale => 
        sale._id.toLowerCase().includes(searchQuery) ||
        sale.customerId.name.toLowerCase().includes(searchQuery) ||
        sale.paymentStatus.toLowerCase().includes(searchQuery)
    );

    const handleView = (id) => {
        // Placeholder: Could fetch details if single bill endpoint exists
        console.log('View sale:', id);
    };

    return (
        <div className={style.salesContainer}>
            <Header name="Sales History"/>
            <div className={style.salesHeader}>
                <div>
                    <h1 className={style.salesTitle}>Sales History</h1>
                    <p className={style.salesSubtitle}>View all customer bills and transactions</p>
                </div>
            </div>

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder="Search sales..." value={searchQuery} onChange={handleSearch} />
                </div>
            </div>

            <section className={style.salesList}>
                <div className={style.salesListHr}>
                    <div className={style.SalesHrChild}>Invoice ID <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SalesHrChild}>Date <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SalesHrChild}>Customer <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SalesHrChild}>Grand Total <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SalesHrChild}>Payment Status <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SalesHrChild}>Action</div>
                </div>
                {filteredSales.map((sale) => (
                    <div key={sale._id} className={style.salesListRow}>
                        <div className={style.salesListChildItem}>
                            <h4 className={style.invoiceId}>{sale._id}</h4>
                        </div>
                        <div className={style.salesListChildItem}>
                            <h4 className={style.date}>{new Date(sale.date).toLocaleString()}</h4>
                        </div>
                        <div className={style.salesListChildItem}>
                            <div className={style.customerInfo}>
                                <h4 className={style.customerName}>{sale.customerId.name}</h4>
                                <p className={style.customerPhone}>{sale.customerId.phone}</p>
                            </div>
                        </div>
                        <div className={style.salesListChildItem}>
                            <h4 className={style.grandTotal}>${sale.grandTotal}</h4>
                        </div>
                        <div className={style.salesListChildItem}>
                            <span className={`${style.statusBadge} ${style[sale.paymentStatus.toLowerCase()]}`}>{sale.paymentStatus}</span>
                        </div>
                        <div className={style.salesListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => handleView(sale._id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default SalesHistory;