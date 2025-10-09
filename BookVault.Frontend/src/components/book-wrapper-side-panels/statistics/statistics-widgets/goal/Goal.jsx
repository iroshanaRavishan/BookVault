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
        </div>
      </div>
    </div>
  )
}
