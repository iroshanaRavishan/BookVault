import React, { useRef, useEffect } from 'react';
import styles from './charts.module.css';

const MiniProgressChart = ({ progress }) => {
  const progressMiniBarChartRef = useRef(null);

  useEffect(() => {
  }, []);

  return (
    <div
      style={{
        width: '25px',
        height: '25px',
        position: 'relative'
      }}
    >
         <div>MiniProgressChart</div>
    </div>
  );
};

export default MiniProgressChart;