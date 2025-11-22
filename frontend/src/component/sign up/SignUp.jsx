import React, { useState } from "react";
import style from './SignUpStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import img from './logo1.png'
import axios from 'axios';
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };









  const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [loading, setLoading] = useState(false); // New loading state
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!username || !password) {
      const messageText ='Username and password are required';
      setError(messageText);
      
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/register', { username, password });
      setError(null);
      setMessage('Registration successful! Please log in.');
      
    } catch (err) {
      setError('Registration failed');
      setMessage('Registration failed');
      
      console.error(err);
    }
  };

  return (
    <>
      <div className={style.container}>
       <div className={style.signUpBox}>
        <img className={style.logo} src={img} alt="" />
        <h1> Join petDetect AI</h1>
        <h4>Create your account and start detecting pets with AI precision</h4>

        <form onSubmit={handleRegister}>
          <label htmlFor="" className={style.signUpLable}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' ,color:'#6b6cd1'}} /> Full Name
          </label>
          <input type="text" className={style.fullWidth} placeholder="Enter your full name" />
          <label htmlFor="" className={style.signUpLable}>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '5px' ,color:'#6b6cd1'}} /> Email Address
          </label>
          <input type="email" value={username}
            onChange={(e) => setUsername(e.target.value)} className={style.fullWidth} placeholder="Enter your Email Address" />
          <label htmlFor="" className={style.signUpLable}>
            <FontAwesomeIcon icon={faLock} style={{ marginRight: '5px' ,color:'#6b6cd1'}} /> Password
          </label>
          <div className={style.passwordContainer}>
            <input 
              type={showPassword ? "text" : "password"} 
              className={style.fullWidth} 
              placeholder="Enter your password" 
              value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              className={style.eyeButton} 
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye} 
                style={{ color: '#000000' ,background:'none',border:'none',cursor:'pointer'}} 
              />
            </button>
          </div>
          <h5>use atleast 8 characters with letters and numbers</h5>
          <div className={style.termsConditions}>
          <input type='checkbox'/>
          <label htmlFor="">I agree to the terms and conditions</label>
          </div>
            <button className={`${style.fullWidth} ${style.submitBtn}`} type="submit">
              <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '5px', color: '#fff' }}/> Create Account
            </button>
            <p>Already have an account? <a href="">Sigin in here</a></p>
        {error && <p style={{color:'red', marginTop:'0.5rem'}}>{error}</p>}
          {message && !error && <p style={{color:'green', marginTop:'0.5rem'}}>{message}</p>}
        </form>
        </div>
      </div>
    </>
  );
}
