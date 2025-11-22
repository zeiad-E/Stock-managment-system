import React, { useState } from "react";
import axios from 'axios';
import styleFromSignUp from '../sign up/SignUpStyle.module.css';
import styleFromLogin from './LoginStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };






    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [loading, setLoading] = useState(false); 

    // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', { username, password });
      const newToken = response.data.token;
      setToken(newToken);
      setIsLoggedIn(true);
      localStorage.setItem('token', newToken); // Store token
      // notify other components in same tab
      window.dispatchEvent(new Event('storage'));
      setError(null);
      setMessage('Login successful!');
    } catch (err) {
      setError('Login failed');
      setMessage('Login failed');
      console.error(err);
    }
  };


  return (<>
  
  <div className={styleFromSignUp.container}>
       <div className={styleFromSignUp.signUpBox} style={{padding: '0'}}>
        {/* <img className={styleFromLogin.logo} src={img} alt="" /> */}
        <div className={styleFromLogin.loginHeader}>
        <h1> Welcome Back</h1>
        <h4>Sign in to your Pet Detection account</h4>
        </div>

        <form onSubmit={handleLogin}>
         
          <label htmlFor="" className={styleFromSignUp.signUpLable}>
            <FontAwesomeIcon icon={faEnvelope} styleFromSignUp={{ marginRight: '5px' ,color:'gray'}} /> Email Address
          </label>
          <input type="email" value={username} onChange={(e)=>setUsername(e.target.value)} className={styleFromSignUp.fullWidth} placeholder="Enter your Email Address" />
          <label htmlFor="" className={styleFromSignUp.signUpLable}>
            <FontAwesomeIcon icon={faLock} styleFromSignUp={{ marginRight: '5px' ,color:'gray'}} /> Password
          </label>
          <div className={styleFromSignUp.passwordContainer}>
            <input 
              type={showPassword ? "text" : "password"} 
              className={styleFromSignUp.fullWidth} 
              placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} 
            />
            <button 
              type="button" 
              className={styleFromSignUp.eyeButton} 
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye} 
                styleFromSignUp={{ color: '#000000' }} 
              />
            </button>
          </div>
          <div className={styleFromSignUp.termsConditions}>
          <input type='checkbox'/>
          <label htmlFor="">remember me</label>
          </div>
            <button  className={`${styleFromSignUp.fullWidth} ${styleFromLogin.submitBtn}`} type="submit">
              <FontAwesomeIcon icon={faUserPlus} styleFromSignUp={{ marginRight: '5px', color: '#fff' }} /> Sign In
            </button>
            <p>Don't have an account? <a href="">Sign up here</a></p>
        {error && <p style={{color:'red',marginTop:'0.5rem'}}>{error}</p>}
          {message && !error && <p style={{color:'green',marginTop:'0.5rem'}}>{message}</p>}
        </form>
        </div>
      </div>
  
  </>);
}
