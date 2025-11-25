import React, { useState, useMemo } from 'react';
import style from './ProfileSettingsStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCamera } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';
import { useLanguage } from '../../context/LanguageContext';

const copyMap = {
    en: {
        headerName: 'Profile Settings',
        uploadPhoto: 'Upload Photo',
        formFields: {
            name: 'Full Name',
            email: 'Email Address',
            password: 'Password',
            phone: 'Phone Number',
            bio: 'Bio',
            location: 'Location',
        },
        passwordPlaceholder: 'Enter new password',
        save: 'Save Changes',
        cancel: 'Cancel',
        accountPreferences: 'Account Preferences',
        toggles: [
            {
                label: 'Email Notifications',
                description: 'Receive notifications about new projects.',
            },
            {
                label: 'SMS Notifications',
                description: 'Receive text messages for urgent updates.',
            },
            {
                label: 'Marketing Emails',
                description: 'Receive tips and product updates.',
            },
        ],
        privacySettings: 'Privacy Settings',
        privacyOptions: [
            {
                label: 'Profile Visibility',
                description: 'Make your profile visible to other users.',
            },
            {
                label: 'Show Activity Status',
                description: "Let others see when you're online.",
            },
        ],
    },
    ar: {
        headerName: 'إعدادات الحساب',
        uploadPhoto: 'رفع صورة',
        formFields: {
            name: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            phone: 'رقم الهاتف',
            bio: 'نبذة',
            location: 'الموقع',
        },
        passwordPlaceholder: 'أدخل كلمة مرور جديدة',
        save: 'حفظ التغييرات',
        cancel: 'إلغاء',
        accountPreferences: 'تفضيلات الحساب',
        toggles: [
            {
                label: 'إشعارات البريد الإلكتروني',
                description: 'استلم إشعارات حول المشاريع الجديدة.',
            },
            {
                label: 'إشعارات الرسائل القصيرة',
                description: 'استلم رسائل نصية للتحديثات العاجلة.',
            },
            {
                label: 'رسائل تسويقية',
                description: 'استلم نصائح وتحديثات المنتج.',
            },
        ],
        privacySettings: 'إعدادات الخصوصية',
        privacyOptions: [
            {
                label: 'ظهور الملف الشخصي',
                description: 'اجعل ملفك الشخصي مرئيًا للمستخدمين الآخرين.',
            },
            {
                label: 'إظهار حالة النشاط',
                description: 'اسمح للآخرين برؤية حالتك عند الاتصال.',
            },
        ],
    },
};

const ProfileSettings = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { language } = useLanguage();
    const copy = useMemo(() => copyMap[language], [language]);

    return (
        <div className={style.profileSettingsContainer}>
            <Header name={copy.headerName} />
            <div className={style.settingsContent}>
                <div className={style.card}>
                    <div className={style.profileHeader}>
                        <div className={style.avatarContainer}>
                            <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" className={style.avatar} />
                            <button className={style.uploadButton}>
                                <FontAwesomeIcon icon={faCamera} />
                            </button>
                        </div>
                        <a href="#" className={style.uploadLink}>{copy.uploadPhoto}</a>
                    </div>

                    <form className={style.profileForm}>
                        <div className={style.formGroup}>
                            <label htmlFor="fullName">{copy.formFields.name}</label>
                            <input type="text" id="fullName" defaultValue="Sarah Johnson" />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="email">{copy.formFields.email}</label>
                            <input type="email" id="email" defaultValue="sarah.johnson@example.com" />
                        </div>
                        <div className={`${style.formGroup} ${style.passwordGroup}`}>
                            <label htmlFor="password">{copy.formFields.password}</label>
                            <input type={passwordVisible ? 'text' : 'password'} id="password" placeholder={copy.passwordPlaceholder} />
                            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className={style.eyeIcon}>
                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="phone">{copy.formFields.phone}</label>
                            <input type="tel" id="phone" defaultValue="+1 (555) 123-4567" />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="bio">{copy.formFields.bio}</label>
                            <textarea id="bio" rows="4" defaultValue="Experienced freelance designer with over 5 years of experience in creating stunning digital experiences."></textarea>
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="location">{copy.formFields.location}</label>
                            <input type="text" id="location" defaultValue="San Francisco, CA" />
                        </div>
                        <div className={style.formActions}>
                            <button type="submit" className={style.saveButton}>{copy.save}</button>
                            <button type="button" className={style.cancelButton}>{copy.cancel}</button>
                        </div>
                    </form>
                </div>

                <div className={style.card}>
                    <h3 className={style.cardTitle}>{copy.accountPreferences}</h3>
                    {copy.toggles.map((toggle, index) => (
                        <div className={style.toggleSetting} key={toggle.label}>
                            <div>
                                <p className={style.settingLabel}>{toggle.label}</p>
                                <p className={style.settingDescription}>{toggle.description}</p>
                            </div>
                            <label className={style.switch}>
                                <input type="checkbox" defaultChecked={index !== 1} />
                                <span className={`${style.slider} ${style.round}`}></span>
                            </label>
                        </div>
                    ))}
                </div>

                <div className={style.card}>
                    <h3 className={style.cardTitle}>{copy.privacySettings}</h3>
                    {copy.privacyOptions.map((option, index) => (
                        <div className={style.toggleSetting} key={option.label}>
                            <div>
                                <p className={style.settingLabel}>{option.label}</p>
                                <p className={style.settingDescription}>{option.description}</p>
                            </div>
                            <label className={style.switch}>
                                <input type="checkbox" defaultChecked={index === 0} />
                                <span className={`${style.slider} ${style.round}`}></span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
