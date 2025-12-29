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
    gradient.addColorStop(1, '#4947e2ff');

    // Apply gradient dynamically
    chart.data.datasets[0].backgroundColor = [gradient, '#f18f8f'];
    chart.update();
  }, [progress]);

  const data = {
    labels: ['Progress', 'Remaining'],
    datasets: [
      {
        data: [progress, 100 - progress],
        borderWidth: 0,
        borderRadius: [0, 0],
        cutout: '50%',
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      animateRotate: true
    },
  };

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