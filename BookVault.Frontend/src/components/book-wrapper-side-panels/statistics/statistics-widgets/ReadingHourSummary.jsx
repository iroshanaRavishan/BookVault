import React from 'react';
import styles from './readinghoursummary.module.css';

export default function ReadingHourSummary() {
  return (
    <div className={styles.hoursSummarySection}>  
        <div className={styles.headerSection}>
            <span>Last 30 days reading hours summary</span>
        </div>
    </div>
  )
}
