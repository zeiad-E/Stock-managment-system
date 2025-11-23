import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './PurchasesHistoryStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort, faEye } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';  // Assume this is unchanged

const PurchasesHistory = () => {
    const [purchasesData, setPurchasesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
const token = localStorage.getItem('token');
    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/supplier-bills/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPurchasesData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredPurchases = purchasesData.filter(purchase => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (purchase._id?.toLowerCase() || '').includes(searchLower) ||
            (purchase.supplierId?.name?.toLowerCase() || '').includes(searchLower) ||
            (purchase.paymentStatus?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleView = (id) => {
        console.log('View purchase:', id);
        // Placeholder: Could fetch details if single bill endpoint exists
    };

    return (
        <div className={style.purchasesContainer}>
            <Header name="Purchases History"/>
            <div className={style.purchasesHeader}>
                <div>
                    <h1 className={style.purchasesTitle}>Purchases History</h1>
                    <p className={style.purchasesSubtitle}>View all supplier bills and transactions</p>
                </div>
            </div>

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder="Search purchases..." value={searchQuery} onChange={handleSearch} />
                </div>
            </div>

            <section className={style.purchasesList}>
                <div className={style.purchasesListHr}>
                    <div className={style.PurchasesHrChild}>Bill ID <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.PurchasesHrChild}>Date <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.PurchasesHrChild}>Supplier <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.PurchasesHrChild}>Grand Total <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.PurchasesHrChild}>Payment Status <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.PurchasesHrChild}>Action</div>
                </div>
                {filteredPurchases.map((purchase) => (
                    <div key={purchase._id} className={style.purchasesListRow}>
                        <div className={style.purchasesListChildItem}>
                            <h4 className={style.billId}>{purchase._id}</h4>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <h4 className={style.date}>{new Date(purchase.date).toLocaleString()}</h4>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <div className={style.supplierInfo}>
                                <h4 className={style.supplierName}>
                                    {purchase.supplierId?.name || 'No Supplier'}
                                </h4>
                                <p className={style.supplierEmail}>
                                    {purchase.supplierId?.email || 'No Email'}
                                </p>
                            </div>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <h4 className={style.grandTotal}>${purchase.grandTotal}</h4>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <span className={`${style.statusBadge} ${style[purchase.paymentStatus.toLowerCase()]}`}>{purchase.paymentStatus}</span>
                        </div>
                        <div className={style.purchasesListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => handleView(purchase._id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default PurchasesHistory;