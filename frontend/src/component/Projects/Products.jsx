import React, { useState, useEffect } from 'react'
import style from './ProductsStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faPlus, faTrash, faEye, faSearch, faSort, faUser } from '@fortawesome/free-solid-svg-icons'
import Header from '../Overview/OverviewChars/Header.jsx'  // Assume this is unchanged
import RecentInventory from './RecentInventory.jsx';  // Renamed from RecentProjects

const Products = () => {
    const [productsData, setProductsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const res = await fetch('http://localhost:3000/api/products/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProductsData(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:3000/api/products/search?q=${query}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Search failed');
                const data = await res.json();
                setProductsData(data);
            } catch (err) {
                console.error(err);
            }
        } else {
            fetchProducts();
        }
    };

    const handleDelete = async (id) => {
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxNjA3LCJleHAiOjE3NjM5MTgwMDd9.nDKG-Zcx3HvM1zArAmMkukClDEvKWbowv1RnT-E95Jw";
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/products/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Delete failed');
            fetchProducts();  // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddProduct = async () => {
        // Placeholder: Open modal/form, collect data, then POST
        const newProduct = {  // Example data; replace with form input
            _id: prompt('Enter ID (e.g., p101)'),
            name: prompt('Enter name'),
            category: prompt('Enter category'),
            buyPrice: parseFloat(prompt('Enter buy price')),
            sellPrice: parseFloat(prompt('Enter sell price')),
            barcode: prompt('Enter barcode'),
            supplierId: prompt('Enter supplier ID')
        };
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/products/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            if (!res.ok) throw new Error('Create failed');
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    // Optional: Fetch suppliers to map ID to name
    // const [suppliers, setSuppliers] = useState([]);
    // useEffect(() => { fetch('http://localhost:3000/api/suppliers/list', {headers...}).then... }, []);
    // Then in render: suppliers.find(s => s._id === product.supplierId)?.name || product.supplierId

    return (
        <div className={style.productsContainer}>
            <Header name="Products"/>
            <div className={style.productsHeader}>
                <div>
                    <h1 className={style.productsTitle}>My Products</h1>
                    <p className={style.productsSubtitle}>Manage and track all your products in one place</p>
                </div>
                <button className={style.addProductBtn} onClick={handleAddProduct}>
                    <FontAwesomeIcon icon={faPlus} /> Add New Product
                </button>
            </div>

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder="Search products..." value={searchQuery} onChange={handleSearch} />
                </div>
                <select className={style.filterSelect}>
                    <option>All Categories</option>
                </select>
                <select className={style.filterSelect}>
                    <option>All Suppliers</option>
                </select>
            </div>

            {isLoading ? (
                <div className={style.loadingState}>
                    <p>Loading products...</p>
                </div>
            ) : error ? (
                <div className={style.errorState}>
                    <p>Error: {error}</p>
                    <button onClick={fetchProducts}>Retry</button>
                </div>
            ) : productsData.length === 0 ? (
                <div className={style.emptyState}>
                    <p>No products found. Add your first product to get started.</p>
                </div>
            ) : (
                <div className={style.productList}>
                <div className={style.productListHr}>
                    <div className={style.ProductHrChild}>ID <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.ProductHrChild}>Product name <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.ProductHrChild}>Supplier <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.ProductHrChild}>Buy Price <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.ProductHrChild}>Sell Price <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.ProductHrChild}>Barcode <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.ProductHrChild}>Action <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                </div>
                {productsData.map((product) => (
                    <div key={product._id} className={style.productListRow}>
                        <div className={style.productListChildItem}>
                            <h4 className={style.budgetAmount}>{product._id}</h4>
                        </div>
                        <div className={`${style.productListChildItem} ${style.productListFirstChildItem}`}>
                            <div className={style.productIcon} style={{ backgroundColor: '#a855f720' }}>
                                <FontAwesomeIcon icon={faBox} style={{ color: '#a855f7', fontSize: '20px' }} />
                            </div>
                            <div>
                                <h4 className={style.productName}>{product.name}</h4>
                                <p className={style.productDescription}>{product.category}</p>
                            </div>
                        </div>
                        <div className={style.productListChildItem}>
                            <div className={style.clientInfo}>  {/* Reused as supplierInfo */}
                                <div className={style.clientAvatar}><FontAwesomeIcon icon={faUser} /></div>
                                <div>
                                    <h4 className={style.clientName}>{product.supplierId}</h4>  {/* Change to name if fetching suppliers */}
                                    <p className={style.clientContact}>Supplier ID</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.productListChildItem}>
                            <div className={style.budgetInfo}>
                                <h4 className={style.budgetAmount}>${product.buyPrice ? product.buyPrice.toFixed(2) : '0.00'}</h4>
                                <p className={style.budgetType}>Buy</p>
                            </div>
                        </div>
                        <div className={style.productListChildItem}>
                            <div className={style.budgetInfo}>
                                <h4 className={style.budgetAmount}>${product.sellPrice ? product.sellPrice.toFixed(2) : '0.00'}</h4>
                                <p className={style.budgetType}>Sell</p>
                            </div>
                        </div>
                        <div className={style.productListChildItem}>
                            <h4 className={style.budgetAmount}>{product.barcode}</h4>
                        </div>
                        <div className={style.productListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => console.log('View', product._id)} />  {/* Add view logic */}
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(product._id)} />
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}

            <section className={style.RecentProduct}>
                <RecentInventory/>
            </section>
        </div>
    )
}

export default Products;