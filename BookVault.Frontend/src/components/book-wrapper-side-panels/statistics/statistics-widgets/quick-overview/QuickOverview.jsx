import React, { useState } from 'react'
import styles from './quickoverview.module.css';
import { PiRobotLight } from "react-icons/pi";
import CircularProgressBar from '../charts/CircularProgressBar';
import { ImFire } from 'react-icons/im';

export default function QuickOverview() {
  const [currentProgress, setCurrentProgress] = useState(68.4); 

  return (
    <div className={styles.quickOverview}>
      <div className={styles.headerSection}>
        <span>Quick Overview</span>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.summaryContent}>
          <span className={styles.aiGeneratedContentText}>You are active in 56% than last week. You have another 2 hour and 30 mins to complete the today's target</span>
          <span className={styles.aiGeneratedIndicator}>
            <PiRobotLight />
            Generated content
          </span>
        </div>
        <div className={styles.contentSectionDetails}>
          <div className={styles.contentSectionLeftDetails}>
            <div className={styles.summaryContent}>
              <span className={styles.totaPageText}>Total Pages - 43</span>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <span className={styles.streakSummary}>
                  <ImFire color='#ff0000ff' size={25}/>
                  <span className={styles.streakText}>
                  </span>
                </span>
                <div className={styles.badgeContainer}>
                  📘
                </div>
              </div>
            </div>
          </div>
          <div className={styles.contentSectionRightDetails}>
            <CircularProgressBar />
          </div>
        </div>
      </div>
      <div className={styles.backgroundClipPath}></div>
    </div>
  )
}
