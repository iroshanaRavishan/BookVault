import React from 'react';
import styles from './totaltimecomparison.module.css';
import CircularProgressBar from '../charts/CircularProgressBar';

export default function TotalTimeComparison() {
  return (
    <div className={styles.totalTimeComparisonSection}>
        <div className={styles.lastWeekSection}>
            <span>Total time in the last week</span>
            <div className={styles.progressBarsContainer}>
              <CircularProgressBar progress={34.8} size={70} hours={3.5} />
              <span>Vs</span>
              <CircularProgressBar progress={72.5} size={70} hours={9.3} />
            </div>
        </div>
        <div className={styles.prevWeekSection}>
            <span style={{ textAlign: 'left' }} className={styles.preWeekSectionText}>Vs Prev week</span>
            <CircularProgressBar progress={45.5} size={70} hours={4.6} />
        </div>
    </div>
  )
}
