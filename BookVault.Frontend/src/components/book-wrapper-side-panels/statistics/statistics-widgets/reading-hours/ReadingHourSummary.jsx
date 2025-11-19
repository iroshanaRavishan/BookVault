import React from 'react';
import styles from './readinghoursummary.module.css';
import BarLineChart from '../charts/BarLineChart';
import { PiRobotLight } from 'react-icons/pi';

export default function ReadingHourSummary() {
  const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  const values = Array.from({ length: 30 }, () => +(Math.random() * 5).toFixed(2));

  return (
    <div className={styles.hoursSummarySection}>  
        <div className={styles.headerSection}>
            <span>Last 30 days' reading summary</span>
        </div>
        <div className={styles.contentSection}>
          <div>
            <BarLineChart showLine={false} width="300px" height="150px" values={values} labels={labels} barThicknessVal={6} targetLineValue={3.8}/>
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.aiGeneratedContentText}>You have reached the goal 4 times within past 30 days,  </span>
            <span className={styles.aiGeneratedIndicator}>
              <PiRobotLight />
              Generated content
            </span>
          </div>
        </div>
    </div>
  )
}
