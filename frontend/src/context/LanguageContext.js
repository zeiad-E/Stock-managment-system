import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {},
});

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('preferredLanguage') || 'en';
  }
  return 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', language);
      document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));

  const value = useMemo(
    () => ({
      language,
      toggleLanguage,
      setLanguage,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

