import React, { useRef } from 'react';
import styles from './charts.module.css';

const MiniProgressChart = () => {
  const progressMiniBarChartRef = useRef(null);
  return (
    <div
      style={{
        width: '25px',
        height: '25px',
        position: 'relative'
      }}
    >
         <div>MiniProgressChart
    </div>
  );
};

export default MiniProgressChart;