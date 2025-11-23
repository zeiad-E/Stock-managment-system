import React, { useState, useEffect } from 'react'
import style from './SuppliersStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faPlus, faTrash, faEye, faSearch, faSort, faUser } from '@fortawesome/free-solid-svg-icons'
import Header from '../Overview/OverviewChars/Header.jsx'  // Assume this is unchanged
import RecentSuppliers from './RecentSuppliers.jsx';

const Suppliers = () => {
    const [suppliersData, setSuppliersData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now; replace with localStorage.getItem('token') after login

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/suppliers/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setSuppliersData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredSuppliers = suppliersData.filter(supplier => 
        supplier.name.toLowerCase().includes(searchQuery) ||
        supplier.contactPerson.toLowerCase().includes(searchQuery) ||
        supplier.phone.includes(searchQuery) ||
        supplier.email.toLowerCase().includes(searchQuery)
    );

    // const handleDelete = async (id) => {
    //     try {
    //         const res = await fetch(`http://localhost:3000/api/suppliers/delete/${id}`, {
    //             method: 'DELETE',
    //             headers: { 'Authorization': `Bearer ${token}` }
    //         });
    //         if (!res.ok) throw new Error('Delete failed');
    //         fetchSuppliers();  // Refresh list
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/suppliers/delete/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to delete supplier');
        }

        // Show success message
        alert('Supplier deleted successfully');
        
        // Refresh the suppliers list
        fetchSuppliers();
    } catch (err) {
        console.error('Delete error:', err);
        alert(err.message || 'An error occurred while deleting the supplier');
    }
};

    const handleView = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/suppliers/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('View failed');
            const data = await res.json();
            console.log('Supplier details:', data);  // Expand to modal or page
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSupplier = async () => {
        // Placeholder: Replace with form/modal inputs
        const newSupplier = {
            _id: prompt('Enter ID (e.g., s1)'),
            name: prompt('Enter name'),
            contactPerson: prompt('Enter contact person'),
            phone: prompt('Enter phone'),
            email: prompt('Enter email'),
            address: prompt('Enter address'),
            notes: prompt('Enter notes')
        };
        try {
            const res = await fetch('http://localhost:3000/api/suppliers/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSupplier)
            });
            if (!res.ok) throw new Error('Create failed');
            fetchSuppliers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={style.suppliersContainer}>
            <Header name="Suppliers"/>
            <div className={style.suppliersHeader}>
                <div>
                    <h1 className={style.suppliersTitle}>My Suppliers</h1>
                    <p className={style.suppliersSubtitle}>Manage and track all your suppliers in one place</p>
                </div>
                <button className={style.addSupplierBtn} onClick={handleAddSupplier}>
                    <FontAwesomeIcon icon={faPlus} /> Add New Supplier
                </button>
            </div>

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder="Search suppliers..." value={searchQuery} onChange={handleSearch} />
                </div>
            </div>

            <section className={style.supplierList}>
                <div className={style.supplierListHr}>
                    <div className={style.SupplierHrChild}>ID <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SupplierHrChild}>Supplier name <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SupplierHrChild}>Contact <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SupplierHrChild}>Email <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SupplierHrChild}>Address <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.SupplierHrChild}>Action <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                </div>
                {filteredSuppliers.map((supplier) => (
                    <div key={supplier._id} className={style.supplierListRow}>
                        <div className={style.supplierListChildItem}>
                            <h4 className={style.supplierId}>{supplier._id}</h4>
                        </div>
                        <div className={`${style.supplierListChildItem} ${style.supplierListFirstChildItem}`}>
                            <div className={style.supplierIcon} style={{ backgroundColor: '#3b82f620' }}>
                                <FontAwesomeIcon icon={faBuilding} style={{ color: '#3b82f6', fontSize: '20px' }} />
                            </div>
                            <div>
                                <h4 className={style.supplierName}>{supplier.name}</h4>
                                <p className={style.supplierDescription}>{supplier.notes}</p>
                            </div>
                        </div>
                        <div className={style.supplierListChildItem}>
                            <div className={style.contactInfo}>
                                <div className={style.contactAvatar}><FontAwesomeIcon icon={faUser} /></div>
                                <div>
                                    <h4 className={style.contactName}>{supplier.contactPerson}</h4>
                                    <p className={style.contactPhone}>{supplier.phone}</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.supplierListChildItem}>
                            <h4 className={style.email}>{supplier.email}</h4>
                        </div>
                        <div className={style.supplierListChildItem}>
                            <h4 className={style.address}>{supplier.address}</h4>
                        </div>
                        <div className={style.supplierListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => handleView(supplier._id)} />
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(supplier._id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section className={style.RecentSupplier}>
                <RecentSuppliers suppliersCount={suppliersData.length} />
            </section>
        </div>
    )
}

export default Suppliers;