import React from 'react';
import styles from './totaltimecomparison.module.css';
import CircularProgressBar from '../charts/CircularProgressBar';

export default function TotalTimeComparison() {
  return (
    <div className={styles.totalTimeComparisonSection}>
        <div className={styles.lastWeekSection}>
            <span>Total time in the last week</span>
            <div className={styles.progressBarsContainer}>
              <CircularProgressBar progress={34.8}/>
              <span>Vs</span>
            </div>
        </div>
        <div className={styles.prevWeekSection}>
            <span style={{ textAlign: 'left' }}>Vs Prev week</span>
            <CircularProgressBar progress={45.5} />
        </div>
    </div>
  )
}
