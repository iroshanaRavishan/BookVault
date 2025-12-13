import React from 'react';
import styles from './goal.module.css';
import { FaCircleDot } from "react-icons/fa6";
import { PiRobotLight } from 'react-icons/pi';

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
          <span>Chart goes here</span>
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
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
            <div key={index} className={styles.miniChartBox}>
              <div>
                <FaCircleDot size={25} />
              </div>
              <span className={styles.daysOfWeek}>{day}</span>
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
