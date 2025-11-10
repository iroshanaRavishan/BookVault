import React from 'react';
import styles from './readinghoursummary.module.css';
import BarLineChart from '../charts/BarLineChart';

export default function ReadingHourSummary() {
  return (
    <div className={styles.hoursSummarySection}>  
        <div className={styles.headerSection}>
            <span>Last 30 days reading hours summary</span>
        </div>
        <div className={styles.contentSection}>
          <div>
            <span>Chart Goes in here...!</span>
          </div>
        </div>
    </div>
  )
}
