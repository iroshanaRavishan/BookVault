import React from "react";
import styles from './charts.module.css';
import { FaArrowRightLong, FaArrowUpLong } from "react-icons/fa6";

const LineWithCumulativeChart = () => {

  return (
    <div className={styles.chartContainer} style={{ width: '200px', height: '100px' }}>
      <span className={styles.chartIndicator} style={{ transform: 'translateX(50%)' }}>
        Hours
        Date
      </span>
    </div>
  );
};

export default LineWithCumulativeChart;
