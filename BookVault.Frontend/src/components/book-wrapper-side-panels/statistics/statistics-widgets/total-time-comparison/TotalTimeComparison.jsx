import React from 'react';
import styles from './totaltimecomparison.module.css';

export default function TotalTimeComparison() {
  return (
    <div className={styles.totalTimeComparisonSection}>
        <div className={styles.lastWeekSection}>
            <span>Total time in the last week</span>
        </div>
        <div className={styles.prevWeekSection}>
            <span>Vs Previous week</span>
        </div>
    </div>
  )
}
