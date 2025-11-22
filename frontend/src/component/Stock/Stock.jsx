import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './StockStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faPlus, faTrash, faEye, faSearch, faSort } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';  // Assume this is unchanged

const Stock = () => {
    const [stockData, setStockData] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now; replace with localStorage.getItem('token') after login

    useEffect(() => {
        fetchStock();
        fetchProducts();
    }, []);

    const fetchStock = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/stock/batches/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStockData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/products/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredStock = stockData.filter(batch => {
        const product = products.find(p => p._id === batch.productId) || {};
        return (
            batch.batchNumber?.toLowerCase().includes(searchQuery) ||
            product.name?.toLowerCase().includes(searchQuery) ||
            batch.notes?.toLowerCase().includes(searchQuery)
        );
    });

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/stock/batches/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchStock();  // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    const handleView = async (id) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/stock/batches/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Batch details:', res.data);  // Expand to modal or page
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddStock = async () => {
        // Placeholder: Replace with form/modal inputs
        const newBatch = {
            productId: prompt('Enter product ID (e.g., p101)'),
            quantity: parseInt(prompt('Enter quantity')),
            expiryDate: prompt('Enter expiry date (YYYY-MM-DD)'),
            batchNumber: prompt('Enter batch number'),
            notes: prompt('Enter notes')
        };
        try {
            await axios.post('http://localhost:3000/api/stock/batches/create', newBatch, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchStock();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={style.stockContainer}>
            <Header name="Stock"/>
            <div className={style.stockHeader}>
                <div>
                    <h1 className={style.stockTitle}>My Stock</h1>
                    <p className={style.stockSubtitle}>Manage and track all your stock batches in one place</p>
                </div>
                <button className={style.addStockBtn} onClick={handleAddStock}>
                    <FontAwesomeIcon icon={faPlus} /> Add New Batch
                </button>
            </div>

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder="Search stock..." value={searchQuery} onChange={handleSearch} />
                </div>
            </div>

            <section className={style.stockList}>
                <div className={style.stockListHr}>
                    <div className={style.StockHrChild}>Product <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.StockHrChild}>Batch Number <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.StockHrChild}>Quantity <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.StockHrChild}>Expiry Date <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.StockHrChild}>Notes <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.StockHrChild}>Action <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                </div>
                {filteredStock.map((batch) => {
                    const product = products.find(p => p._id === batch.productId) || {};
                    return (
                        <div key={batch._id} className={style.stockListRow}>
                            <div className={`${style.stockListChildItem} ${style.stockListFirstChildItem}`}>
                                <div className={style.stockIcon} style={{ backgroundColor: '#14b8a620' }}>
                                    <FontAwesomeIcon icon={faBoxes} style={{ color: '#14b8a6', fontSize: '20px' }} />
                                </div>
                                <div>
                                    <h4 className={style.stockName}>{product.name || batch.productId}</h4>
                                    <p className={style.stockDescription}>{product.category}</p>
                                </div>
                            </div>
                            <div className={style.stockListChildItem}>
                                <h4 className={style.batchNumber}>{batch.batchNumber}</h4>
                            </div>
                            <div className={style.stockListChildItem}>
                                <h4 className={style.quantity}>{batch.quantity}</h4>
                            </div>
                            <div className={style.stockListChildItem}>
                                <h4 className={style.expiryDate}>{batch.expiryDate}</h4>
                            </div>
                            <div className={style.stockListChildItem}>
                                <p className={style.notes}>{batch.notes}</p>
                            </div>
                            <div className={style.stockListChildItem}>
                                <div className={style.actionIcons}>
                                    <FontAwesomeIcon icon={faEye} onClick={() => handleView(batch._id)} />
                                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(batch._id)} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
};

export default Stock;