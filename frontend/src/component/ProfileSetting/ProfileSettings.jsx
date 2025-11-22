import React, { useState } from 'react';
import style from './ProfileSettingsStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCamera } from '@fortawesome/free-solid-svg-icons';
import Header from '../Overview/OverviewChars/Header.jsx';

const ProfileSettings = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className={style.profileSettingsContainer}>
            <Header name="Profile Settings" />
            <div className={style.settingsContent}>
                <div className={style.card}>
                    <div className={style.profileHeader}>
                        <div className={style.avatarContainer}>
                            <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" className={style.avatar} />
                            <button className={style.uploadButton}>
                                <FontAwesomeIcon icon={faCamera} />
                            </button>
                        </div>
                        <a href="#" className={style.uploadLink}>Upload Photo</a>
                    </div>

                    <form className={style.profileForm}>
                        <div className={style.formGroup}>
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" defaultValue="Sarah Johnson" />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" defaultValue="sarah.johnson@example.com" />
                        </div>
                        <div className={`${style.formGroup} ${style.passwordGroup}`}>
                            <label htmlFor="password">Password</label>
                            <input type={passwordVisible ? 'text' : 'password'} id="password" placeholder="Enter new password" />
                            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className={style.eyeIcon}>
                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" defaultValue="+1 (555) 123-4567" />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="bio">Bio</label>
                            <textarea id="bio" rows="4" defaultValue="Experienced freelance designer with over 5 years of experience in creating stunning digital experiences."></textarea>
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="location">Location</label>
                            <input type="text" id="location" defaultValue="San Francisco, CA" />
                        </div>
                        <div className={style.formActions}>
                            <button type="submit" className={style.saveButton}>Save Changes</button>
                            <button type="button" className={style.cancelButton}>Cancel</button>
                        </div>
                    </form>
                </div>

                <div className={style.card}>
                    <h3 className={style.cardTitle}>Account Preferences</h3>
                    <div className={style.toggleSetting}>
                        <div>
                            <p className={style.settingLabel}>Email Notifications</p>
                            <p className={style.settingDescription}>Receive notifications about new projects.</p>
                        </div>
                        <label className={style.switch}>
                            <input type="checkbox" defaultChecked />
                            <span className={`${style.slider} ${style.round}`}></span>
                        </label>
                    </div>
                    <div className={style.toggleSetting}>
                        <div>
                            <p className={style.settingLabel}>SMS Notifications</p>
                            <p className={style.settingDescription}>Receive text messages for urgent updates.</p>
                        </div>
                        <label className={style.switch}>
                            <input type="checkbox" />
                            <span className={`${style.slider} ${style.round}`}></span>
                        </label>
                    </div>
                    <div className={style.toggleSetting}>
                        <div>
                            <p className={style.settingLabel}>Marketing Emails</p>
                            <p className={style.settingDescription}>Receive tips and product updates.</p>
                        </div>
                        <label className={style.switch}>
                            <input type="checkbox" defaultChecked />
                            <span className={`${style.slider} ${style.round}`}></span>
                        </label>
                    </div>
                </div>

                <div className={style.card}>
                    <h3 className={style.cardTitle}>Privacy Settings</h3>
                    <div className={style.toggleSetting}>
                        <div>
                            <p className={style.settingLabel}>Profile Visibility</p>
                            <p className={style.settingDescription}>Make your profile visible to other users.</p>
                        </div>
                        <label className={style.switch}>
                            <input type="checkbox" defaultChecked />
                            <span className={`${style.slider} ${style.round}`}></span>
                        </label>
                    </div>
                    <div className={style.toggleSetting}>
                        <div>
                            <p className={style.settingLabel}>Show Activity Status</p>
                            <p className={style.settingDescription}>Let others see when you're online.</p>
                        </div>
                        <label className={style.switch}>
                            <input type="checkbox" />
                            <span className={`${style.slider} ${style.round}`}></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
