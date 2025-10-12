import React from 'react';
import styles from './totaltime.module.css';

export default function TotalTime() {
  return (
      <div className={styles.totalTimeSpentSection}>  
        <div className={styles.headerSection}>
          <span>Total Time Spent</span>
        </div>
        <div className={styles.contentSection}>
          <div className={styles.timeSpentSummarySection}>
            <span className={styles.timeSpentValue}> 
              <span className={styles.dateValue}>5</span> 
              <span className={styles.dateLabel}>D</span>
              </span>
            <span className={styles.timeSpentComparison}>+2h 30m than last week</span>
          </div>
          <span className={styles.totalTimeSeparator}></span>
          <div className={styles.timeSpentDetailsChartSection}>
            <span className={styles.timeSpentDetailsText}>Screen timing Past 7 days Trends</span>
            <div className={styles.chartSection}>
              <button>prev</button>
              <span>Chart Goes in here...!</span>
              <button>next</button>
            </div>
          </div>
        </div>
      </div>
  )
}
