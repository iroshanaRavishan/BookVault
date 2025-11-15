import React from 'react';
import styles from './readinghoursummary.module.css';
import BarLineChart from '../charts/BarLineChart';
import { PiRobotLight } from 'react-icons/pi';

export default function ReadingHourSummary() {
  return (
    <div className={styles.hoursSummarySection}>  
        <div className={styles.headerSection}>
            <span>Last 30 days' reading summary</span>
        </div>
        <div className={styles.contentSection}>
          <div>
            <BarLineChart showLine={false} width="300px" height="150px" />
          </div>
        </div>
    </div>
  )
}
