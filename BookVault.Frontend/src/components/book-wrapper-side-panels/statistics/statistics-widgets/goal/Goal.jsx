import React from 'react';
import styles from './goal.module.css';
import { PiRobotLight } from 'react-icons/pi';
import MiniProgressChart from '../charts/MiniProgressChart';
import BarLineChart from '../charts/BarLineChart';

export default function Goal() {
  const labels = Array.from({ length: 7 }, (_, i) => `${i + 1}`);
  const values = Array.from({ length: 7 }, () => +(Math.random() * 5).toFixed(2));

  return (
    <div className={styles.goalSection}>  
      <div className={styles.headerSection}>
          <span>Goal</span>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.contentSectionLeftDetails}>
          <span style={{ textAlign: 'left', marginBottom: '10px' }} className={styles.preWeekSectionText}>Minutes to complete to today’s goal</span>
          <CircularProgressBar progress={45.5} size={100} hours={4.6} />
        </div>
        <div className={styles.contentSectionRightDetails}>
          <span className={styles.aiGeneratedIndicator}>
            <PiRobotLight />
            Generated content
          </span>
          <span>Sample text sample text. Sample text Sample TEXT sample.</span>
        </div>
      </div>
      <div className={styles.goalSummarySection}>
        <div className={styles.miniCharts}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
            const randomProgress = Math.floor(Math.random() * (90 - 10 + 1)) + 10;
            return (
              <div key={index} className={styles.miniChartBox}>
                <div>
                  <MiniProgressChart progress={randomProgress} />
                </div>
                <span className={styles.daysOfWeek}>{day}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.sevenDayLineChart}>
          <BarLineChart showLine={true} showBars={false} width="500px" height="200px" values={values} labels={labels} showIndicator={false} />
        </div>
      </div>
    </div>
  )
}
