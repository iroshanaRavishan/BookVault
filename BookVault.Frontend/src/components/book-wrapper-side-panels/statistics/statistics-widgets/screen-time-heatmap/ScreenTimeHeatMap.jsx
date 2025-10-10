import React from 'react';
import styles from './screentimeheatmap.module.css';

export default function ScreenTimeHeatMap() {
  const days = ["2", "3", "4", "5", "6", "7", "8"];
  const times = ["0", "2", "4", "6", "8", "10", "12", "2", "4", "6", "8", "10"];

  // Just random data for visual testing (0–4 intensity)
  const generateRandomData = () =>
    Array.from({ length: 7 }, () =>
      Array.from({ length: 12 }, () => Math.floor(Math.random() * 5))
    );
  return (
    <div className={styles.totalScreenTimeSection}>  
      <div className={styles.headerSection}>
        <span>Total  Screen Time - (Hourly basis) <small>for last 7 days</small></span>
      </div>
      <div className={styles.contentSection}>
        <span>Chart goes here</span>
      </div>
    </div>
  )
}
