import React, { useState } from 'react';
import styles from './totaltime.module.css';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { FaArrowUp } from "react-icons/fa";
import BarLineChart from '../charts/BarLineChart';

export default function TotalTime() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const labels = Array.from({ length: 7 }, (_, i) => `${i + 1}`);
  const values = Array.from({ length: 7 }, () => +(Math.random() * 5).toFixed(2));

  const charts = [
    { component: <BarLineChart showLine={true} width="200px" height="100px" values={values} labels={labels} />, label: "Bar chart with line" },
    { component: "Line With Cumulative Chart", label: "Cumulative chart" },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < charts.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : prev
    );
  };

  return (
      <div className={styles.totalTimeSpentSection}>  
        <div className={styles.headerSection}>
          <span>Total Time Spent</span>
        </div>
        <div className={styles.contentSection}>
          <div className={styles.timeSpentSummarySection}>
            <div className={styles.timeSpentValueSection}>
              <div className={styles.timeSpentValue}> 
                <span className={styles.dateValue}>5</span> 
                <span className={styles.dateLabel}>D</span>
                <span className={styles.hoursValue}>2</span>
                <span className={styles.hoursLable}>H</span>
              </div>
              <div>
              <span className={styles.minsValue}>56</span>
                <span className={styles.minsLable}>min(s)</span>
              </div>
            </div>
            <span className={styles.timeSpentComparison}> <FaArrowUp size={20}/> +2h 30m than last week</span>
            <span className={styles.lastOpenDate}> Last Open  12/12/2020 </span>
          </div>
          <span className={styles.totalTimeSeparator}></span>
          <div className={styles.timeSpentDetailsChartSection}>
            <span className={styles.timeSpentDetailsText}>Screen timing trend in past 7 day's </span>
            <div className={styles.chartSection}>
              <div className={styles.sliderWrapper}>
                <div className={styles.slider}>
                  <div className={styles.slide}></div>

              <div className={styles.chartNavigationButtons}>
                <button className={styles.chartNavigationButton} onClick={handlePrev} disabled={currentIndex === 0}>
                  <GoChevronLeft />
                </button>
                <span className={styles.chartTypes}>
                  {charts[currentIndex].label}
                </span>
                <button className={styles.chartNavigationButton} onClick={handleNext} >
                  <GoChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
