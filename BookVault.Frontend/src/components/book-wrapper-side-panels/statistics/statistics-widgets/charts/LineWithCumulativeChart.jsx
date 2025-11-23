import React, { useRef } from "react";
import styles from './charts.module.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { FaArrowRightLong, FaArrowUpLong } from "react-icons/fa6";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const LineWithCumulativeChart = () => {
  const cumulativeChartRef = useRef(null);

  return (
    <div className={styles.chartContainer} style={{ width: '200px', height: '100px' }}>
      <span className={styles.chartIndicator} style={{ transform: 'translateX(50%)' }}>
        Hours <FaArrowUpLong />
        Date  <FaArrowRightLong style={{marginTop: '2px'}} /> 
      </span>
      <Chart ref={cumulativeChartRef} type="line" />      
    </div>
  );
};

export default LineWithCumulativeChart;
