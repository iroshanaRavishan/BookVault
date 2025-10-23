import React from 'react';
import styles from './goal.module.css';

export default function Goal() {
  return (
    <div className={styles.goalSection}>  
      <div className={styles.headerSection}>
          <span>Goal</span>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.contentSectionLeftDetails}>
          <span>Chart goes here</span>
        </div>
        <div className={styles.contentSectionRightDetails}>
          <span>AI Generated content</span>
        </div>
      </div>
      <div className={styles.goalSummarySection}>
        <div className={styles.miniCharts}>
          {[...Array(7)].map((_, index) => (
            <div>
             <span>Day {index + 1}</span>
            </div>
          ))}
        </div>
        <div className={styles.sevenDayLineChart}>
          <span>Seven days line chart goes in here</span>
        </div>
      </div>
    </div>
  )
}
