import React from 'react';
import style from './ProgressBarStyle.module.css';

const ProgressBar = ({ progress }) => {
    const getColor = () => {
        if (progress < 40) return '#f59e0b'; // Pending/Low
        if (progress < 70) return '#3b82f6'; // Active/Medium
        return '#22c55e'; // Completed/High
    };

    return (
        <div className={style.progressContainer}>
            <div className={style.progressBarBackground}>
                <div className={style.progressBarFill} style={{ width: `${progress}%`, backgroundColor: getColor() }}></div>
            </div>
            <span className={style.progressText}>{progress}%</span>
        </div>
    );
};

export default ProgressBar;
