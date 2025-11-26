import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './component/Menu/Menu.jsx';
import Overview from './component/Overview/Overview.jsx';
// import Projects from './component/Projects/Projects.jsx';
import Products from './component/Projects/Products.jsx';
import ProfileSettings from './component/ProfileSetting/ProfileSettings.jsx';
import Login from './component/login/Login.jsx';
import SignUp from './component/sign up/SignUp.jsx';
import Suppliers from './component/Suppliers/Suppliers.jsx';
import Customers from './component/Customers/Customers.jsx';
import Stock from './component/Stock/Stock.jsx';
import BuyFromSupplier from './component/FeedStoch/BuyFromSupplier.jsx';
import SellToCustomer from './component/Sell/SellToCustomer.jsx';
import Returns from './component/Return/Returns.jsx';
import SalesHistory from './component/History/SalesHistory.jsx';
import PurchasesHistory from './component/History/PurchasesHistory.jsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const AppContent = () => {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className={`model ${language === 'ar' ? 'model-rtl' : 'model-ltr'}`}>
          <aside className='sidebar'>
            <Menu />
          </aside>
          <div className='content'>
            <Routes>
              <Route path="/" element={<Overview isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
              <Route path="/projects" element={<Products />} />
              <Route path="/settings" element={<ProfileSettings />} />
              <Route path='/suppliers' element={<Suppliers/>}/>
              <Route path='/customers' element={<Customers/>}/>
              <Route path='/stock' element={<Stock/>}/>
              <Route path='/buy-from-supplier' element={<BuyFromSupplier/>}/>
              <Route path='/sell-to-customer' element={<SellToCustomer/>}/>
              <Route path='/returns' element={<Returns/>}/>
              <Route path='/sales-history' element={<SalesHistory/>}/>
              <Route path='/purchases-history' element={<PurchasesHistory/>}/>
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
