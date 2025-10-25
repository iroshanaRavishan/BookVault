import React from 'react';
import styles from './readinghoursummary.module.css';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

export default function ReadingHourSummary() {
  return (
    <div className={styles.hoursSummarySection}>  
        <div className={styles.headerSection}>
            <span>Last 30 days reading hours summary</span>
        </div>
        <div className={styles.contentSection}>
          <button><GoChevronLeft /></button>
          <span>Chart Goes in here...!</span>
          <button><GoChevronRight /></button>
        </div>
    </div>
  )
}
