import React from 'react';
import styles from './totaltime.module.css';

export default function TotalTime() {
  return (
      <div className={styles.totalTimeSpentSection}>  
        <div className={styles.headerSection}>
          <span>Total Time Spent</span>
        </div>
        <div className={styles.contentSection}>
          <div>
            <span className={styles.timeSpentValue}>5D 2h 56m</span>
            <span className={styles.timeSpentComparison}>+2h 30m than last week</span>
          </div>
          <div className={styles.timeSpentDetailsChartSection}>
          </div>
        </div>
      </div>
  )
}
