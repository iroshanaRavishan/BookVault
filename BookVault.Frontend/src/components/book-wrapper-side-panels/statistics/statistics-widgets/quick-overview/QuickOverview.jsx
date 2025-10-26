import React from 'react'
import styles from './quickoverview.module.css';
import { PiRobotLight } from "react-icons/pi";
import CircularProgressBar from '../charts/CircularProgressBar';

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
            <span className={styles.aiGeneratedIndicator}>
              <PiRobotLight />
              Generated content
            </span>
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.totaPageText}>Total Pages - 43</span>
            <span className={styles.progressText}>56.4%</span>
        <div>
            <CircularProgressBar/>
          </div>
        <div className={styles.contentSectionRightDetails}>
            <CircularProgressBar />
        </div>
      </div>
      <div className={styles.backgroundClipPath}></div>
    </div>
  )
}
