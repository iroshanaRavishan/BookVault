import React from 'react'
import styles from './quickoverview.module.css'

export default function QuickOverview() {
  return (
    <div className={styles.quickOverview}>
      <div className={styles.headerSection}>
        <span>Quick Overview</span>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.contentSectionLeftDetails}>
          <div className={styles.summaryContent}>
            <span className={styles.aiGeneratedContentText}>You are active in 56% than last week.</span>
            <span className={styles.aiGeneratedIndicator}>Generated content</span>
          </div>
          <div className={styles.summaryContent}>
            <span>Total Pages - 43</span>
            <span>56.4%</span>
          </div>
        </div>
        <div className={styles.contentSectionRightDetails}>
          <span>Chart Goes in here...!</span>
        </div>
      </div>
      <div className={styles.backgroundClipPath}></div>
    </div>
  )
}
