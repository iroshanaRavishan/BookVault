import React from 'react';
import styles from './screentimeheatmap.module.css';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

export default function ScreenTimeHeatMap() {
  const days = ["2", "3", "4", "5", "6", "7", "8"];
  const times = ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"];

  // Just random data for visual testing (0–4 intensity)
  const generateRandomData = () =>
    Array.from({ length: 7 }, () =>
      Array.from({ length: 12 }, () => Math.floor(Math.random() * 5))
    );

  const data = generateRandomData();

  return (
    <div className={styles.totalScreenTimeSection}>  
      <div className={styles.headerSection}>
        <span>Total Screen Time - (Hourly basis) <small>for last 7 days</small></span>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.timeLabels}>
          <span></span> 
          {times.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className={styles.gridContainer}>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className={styles.row}>
              <span className={styles.dayLabel}>{day}</span>
              {data[dayIndex].map((value, timeIndex) => (
                <div
                  key={timeIndex}
                  className={`${styles.cell} ${styles[`level${value}`]}`}
                  title={`${day} - ${times[timeIndex]}h`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
