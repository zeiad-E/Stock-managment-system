import React, { useState, useEffect } from 'react'
import style from './CustomersStyle.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPlus, faTrash, faEye, faSearch, faSort, faUser } from '@fortawesome/free-solid-svg-icons'
import Header from '../Overview/OverviewChars/Header.jsx'  // Assume this is unchanged

const Customers = () => {
    const [customersData, setCustomersData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InplaWFkIiwiaWF0IjoxNzYzODMxMzI1LCJleHAiOjE3NjM5MTc3MjV9.Z4ji_FFgpCTz_3Ly8SCFoa8T2SFGICUk5D8laAitazs";  // Hardcoded for now; replace with localStorage.getItem('token') after login

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/customers/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setCustomersData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            try {
                const res = await fetch(`http://localhost:3000/api/customers/search?q=${query}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Search failed');
                const data = await res.json();
                setCustomersData(data);
            } catch (err) {
                console.error(err);
            }
        } else {
            fetchCustomers();
        }
    };
const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const res = await fetch(`http://localhost:3000/api/customers/delete/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to delete customer');
        }

        // Show success message
        alert(data.message || 'Customer deleted successfully');
        
        // Refresh the customers list
        fetchCustomers();
    } catch (err) {
        console.error('Delete error:', err);
        alert(err.message || 'An error occurred while deleting the customer');
    }
};
    const handleView = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/customers/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('View failed');
            const data = await res.json();
            console.log('Customer details:', data);  // Expand to modal or page
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCustomer = async () => {
        // Placeholder: Replace with form/modal inputs
        const newCustomer = {
            _id: prompt('Enter ID (e.g., c1)'),
            name: prompt('Enter name'),
            contactPerson: prompt('Enter contact person'),
            phone: prompt('Enter phone'),
            address: prompt('Enter address'),
            notes: prompt('Enter notes')
        };
        try {
            const res = await fetch('http://localhost:3000/api/customers/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCustomer)
            });
            if (!res.ok) throw new Error('Create failed');
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={style.customersContainer}>
            <Header name="Customers"/>
            <div className={style.customersHeader}>
                <div>
                    <h1 className={style.customersTitle}>My Customers</h1>
                    <p className={style.customersSubtitle}>Manage and track all your customers in one place</p>
                </div>
                <button className={style.addCustomerBtn} onClick={handleAddCustomer}>
                    <FontAwesomeIcon icon={faPlus} /> Add New Customer
                </button>
            </div>

            <div className={style.filters}>
                <div className={style.searchInput}>
                    <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
                    <input type="text" placeholder="Search customers..." value={searchQuery} onChange={handleSearch} />
                </div>
            </div>

            <section className={style.customerList}>
                <div className={style.customerListHr}>
                    <div className={style.CustomerHrChild}>Customer name <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.CustomerHrChild}>Contact Person <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.CustomerHrChild}>Phone <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.CustomerHrChild}>Address <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                    <div className={style.CustomerHrChild}>Action <FontAwesomeIcon icon={faSort} className={style.sortIcon} /></div>
                </div>
                {customersData.map((customer) => (
                    <div key={customer._id} className={style.customerListRow}>
                        <div className={`${style.customerListChildItem} ${style.customerListFirstChildItem}`}>
                            <div className={style.customerIcon} style={{ backgroundColor: '#22c55e20' }}>
                                <FontAwesomeIcon icon={faUsers} style={{ color: '#22c55e', fontSize: '20px' }} />
                            </div>
                            <div>
                                <h4 className={style.customerName}>{customer.name}</h4>
                                <p className={style.customerDescription}>{customer.notes}</p>
                            </div>
                        </div>
                        <div className={style.customerListChildItem}>
                            <div className={style.contactInfo}>
                                <div className={style.contactAvatar}><FontAwesomeIcon icon={faUser} /></div>
                                <div>
                                    <h4 className={style.contactName}>{customer.contactPerson}</h4>
                                </div>
                            </div>
                        </div>
                        <div className={style.customerListChildItem}>
                            <h4 className={style.phone}>{customer.phone}</h4>
                        </div>
                        <div className={style.customerListChildItem}>
                            <h4 className={style.address}>{customer.address}</h4>
                        </div>
                        <div className={style.customerListChildItem}>
                            <div className={style.actionIcons}>
                                <FontAwesomeIcon icon={faEye} onClick={() => handleView(customer._id)} />
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(customer._id)} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}

export default Customers;