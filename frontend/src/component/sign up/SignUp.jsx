import React, { useState, useMemo } from "react";
import style from './SignUpStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import img from './logo1.png'
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
const copyMap = {
  en: {
    title: 'Join Stock Management',
    subtitle: 'Create your account and start managing inventory with confidence',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    email: 'Email Address',
    emailPlaceholder: 'Enter your Email Address',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    passwordHint: 'Use at least 8 characters with letters and numbers',
    terms: 'I agree to the terms and conditions',
    submit: 'Create Account',
    haveAccount: 'Already have an account?',
    signinLink: 'Sign in here',
    requiredError: 'Username and password are required',
    success: 'Registration successful! Please log in.',
    failure: 'Registration failed',
  },
  ar: {
    title: 'انضم إلى إدارة المخزون',
    subtitle: 'أنشئ حسابك وابدأ إدارة المخزون بثقة',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'أدخل اسمك الكامل',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    passwordHint: 'استخدم 8 أحرف على الأقل تحتوي على حروف وأرقام',
    terms: 'أوافق على الشروط والأحكام',
    submit: 'إنشاء حساب',
    haveAccount: 'لديك حساب بالفعل؟',
    signinLink: 'سجّل الدخول هنا',
    requiredError: 'اسم المستخدم وكلمة المرور مطلوبان',
    success: 'تم التسجيل بنجاح! يرجى تسجيل الدخول.',
    failure: 'فشل التسجيل',
  },
};

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
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!username || !password) {
      const messageText =copy.requiredError;
      setError(messageText);
      
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/register', { username, password });
      setError(null);
      setMessage(copy.success);
      
    } catch (err) {
      setError(copy.failure);
      setMessage(copy.failure);
      
      console.error(err);
    }
  };

  return (
    <>
      <div className={style.container}>
       <div className={style.signUpBox}>
        <img className={style.logo} src={img} alt="" />
        <h1>{copy.title}</h1>
        <h4>{copy.subtitle}</h4>

        <form onSubmit={handleRegister}>
          <label htmlFor="" className={style.signUpLable}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' ,color:'#6b6cd1'}} /> {copy.fullName}
          </label>
          <input type="text" className={style.fullWidth} placeholder={copy.fullNamePlaceholder} />
          <label htmlFor="" className={style.signUpLable}>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '5px' ,color:'#6b6cd1'}} /> {copy.email}
          </label>
          <input type="email" value={username}
            onChange={(e) => setUsername(e.target.value)} className={style.fullWidth} placeholder={copy.emailPlaceholder} />
          <label htmlFor="" className={style.signUpLable}>
            <FontAwesomeIcon icon={faLock} style={{ marginRight: '5px' ,color:'#6b6cd1'}} /> {copy.password}
          </label>
          <div className={style.passwordContainer}>
            <input 
              type={showPassword ? "text" : "password"} 
              className={style.fullWidth} 
              placeholder={copy.passwordPlaceholder} 
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
          <h5>{copy.passwordHint}</h5>
          <div className={style.termsConditions}>
          <input type='checkbox'/>
          <label htmlFor="">{copy.terms}</label>
          </div>
            <button className={`${style.fullWidth} ${style.submitBtn}`} type="submit">
              <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '5px', color: '#fff' }}/> {copy.submit}
            </button>
            <p>{copy.haveAccount} <a href="">{copy.signinLink}</a></p>
        {error && <p style={{color:'red', marginTop:'0.5rem'}}>{error}</p>}
          {message && !error && <p style={{color:'green', marginTop:'0.5rem'}}>{message}</p>}
        </form>
        </div>
      </div>
    </>
  );
}
