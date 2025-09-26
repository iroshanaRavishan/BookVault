import React from 'react';
import styles from './totaltime.module.css';

export default function TotalTime() {
  return (
      <div className={styles.totalTimeSpentSection}>  
        <div className={styles.headerSection}>
          <span>Total Time Spent</span>
        </div>
        <div className={styles.contentSection}>
        </div>
      </div>
  )
}
