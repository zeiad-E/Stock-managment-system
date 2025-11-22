import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './component/Menu/Menu.jsx';
import Overview from './component/Overview/Overview.jsx';
// import Projects from './component/Projects/Projects.jsx';
import Products from './component/Projects/Products.jsx';
import ProfileSettings from './component/ProfileSetting/ProfileSettings.jsx';
import Login from './component/login/Login.jsx';
import SignUp from './component/sign up/SignUp.jsx';
import Suppliers from './component/Suppliers/Suppliers.jsx';
import Customers from './component/Customers/Customers.jsx';
function App() {
  return (
    <Router>
      <div className='model'> 
        <Menu/>
        <div className='content'>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/projects" element={<Products />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path='/suppliers' element={<Suppliers/>}/>
            <Route path='/customers' element={<Customers/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
