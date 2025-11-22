import React from "react";
import styles from './charts.module.css';

const LineWithCumulativeChart = () => {

  return (
    <div className={styles.chartContainer} style={{ width: '200px', height: '100px' }}>
      <span className={styles.chartIndicator} style={{ transform: 'translateX(50%)' }}></span>
    </div>
  );
};

export default LineWithCumulativeChart;
