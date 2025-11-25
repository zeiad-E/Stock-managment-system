import React, { useState, useMemo } from "react";
import axios from 'axios';
import styleFromSignUp from '../sign up/SignUpStyle.module.css';
import styleFromLogin from './LoginStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';
const copyMap = {
  en: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your Stock Management account',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your Email Address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    rememberMe: 'Remember me',
    submit: 'Sign In',
    noAccount: "Don't have an account?",
    signupLink: 'Sign up here',
    requiredError: 'Username and password are required',
    success: 'Login successful!',
    failure: 'Login failed',
  },
  ar: {
    title: 'مرحباً بعودتك',
    subtitle: 'سجّل الدخول إلى حساب إدارة المخزون الخاص بك',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    rememberMe: 'تذكرني',
    submit: 'تسجيل الدخول',
    noAccount: 'لا تملك حساباً؟',
    signupLink: 'سجّل هنا',
    requiredError: 'اسم المستخدم وكلمة المرور مطلوبان',
    success: 'تم تسجيل الدخول بنجاح!',
    failure: 'فشل تسجيل الدخول',
  },
};

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
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);

    // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!username || !password) {
      setError(copy.requiredError);
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
      setMessage(copy.success);
    } catch (err) {
      setError(copy.failure);
      setMessage(copy.failure);
      console.error(err);
    }
  };


  return (<>
  
  <div className={styleFromSignUp.container}>
       <div className={styleFromSignUp.signUpBox} style={{padding: '0'}}>
        {/* <img className={styleFromLogin.logo} src={img} alt="" /> */}
        <div className={styleFromLogin.loginHeader}>
        <h1>{copy.title}</h1>
        <h4>{copy.subtitle}</h4>
        </div>

        <form onSubmit={handleLogin}>
         
          <label htmlFor="" className={styleFromSignUp.signUpLable}>
            <FontAwesomeIcon icon={faEnvelope} styleFromSignUp={{ marginRight: '5px' ,color:'gray'}} /> {copy.emailLabel}
          </label>
          <input type="email" value={username} onChange={(e)=>setUsername(e.target.value)} className={styleFromSignUp.fullWidth} placeholder={copy.emailPlaceholder} />
          <label htmlFor="" className={styleFromSignUp.signUpLable}>
            <FontAwesomeIcon icon={faLock} styleFromSignUp={{ marginRight: '5px' ,color:'gray'}} /> {copy.passwordLabel}
          </label>
          <div className={styleFromSignUp.passwordContainer}>
            <input 
              type={showPassword ? "text" : "password"} 
              className={styleFromSignUp.fullWidth} 
              placeholder={copy.passwordPlaceholder} value={password} onChange={(e)=>setPassword(e.target.value)} 
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
          <label htmlFor="">{copy.rememberMe}</label>
          </div>
            <button  className={`${styleFromSignUp.fullWidth} ${styleFromLogin.submitBtn}`} type="submit">
              <FontAwesomeIcon icon={faUserPlus} styleFromSignUp={{ marginRight: '5px', color: '#fff' }} /> {copy.submit}
            </button>
            <p>{copy.noAccount} <a href="">{copy.signupLink}</a></p>
        {error && <p style={{color:'red',marginTop:'0.5rem'}}>{error}</p>}
          {message && !error && <p style={{color:'green',marginTop:'0.5rem'}}>{message}</p>}
        </form>
        </div>
      </div>
  
  </>);
}
