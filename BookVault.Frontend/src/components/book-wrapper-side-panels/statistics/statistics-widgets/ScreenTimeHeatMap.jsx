import React from 'react';
import styles from './screentimeheatmap.module.css';

export default function ScreenTimeHeatMap() {
  return (
    <div className={styles.totalScreenTimeSection}>  
      <div className={styles.headerSection}>
        <span>Total  Screen Time - (Hourly basis) <small>for last 7 days</small></span>
      </div>
      <div className={styles.contentSection}>
      </div>
    </div>
  )
}
