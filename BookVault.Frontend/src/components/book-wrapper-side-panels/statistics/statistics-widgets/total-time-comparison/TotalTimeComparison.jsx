import React from 'react';
import styles from './totaltimecomparison.module.css';

export default function TotalTimeComparison() {
  return (
    <div className={styles.totalTimeComparisonSection}>
        <div className={styles.lastWeekSection}>
            <span>Total time in the last week</span>
            <div className={styles.progressBarsContainer}>
            </div>
        </div>
        <div className={styles.prevWeekSection}>
            <span style={{ textAlign: 'left' }}>Vs Prev week</span>
            <span>Vs Previous week</span>
        </div>
    </div>
  )
}
