import React, { useRef, useEffect } from 'react';
import styles from './charts.module.css';

const MiniProgressChart = ({ progress }) => {
  const progressMiniBarChartRef = useRef(null);

  useEffect(() => {
    const chart = progressMiniBarChartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;

    // Create gradient for the progress arc
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, '#97b4f5ff');
  }, [progress]);

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