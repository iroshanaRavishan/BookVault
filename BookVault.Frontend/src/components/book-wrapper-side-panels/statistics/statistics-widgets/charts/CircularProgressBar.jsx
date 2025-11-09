import React, { useRef, useEffect } from 'react';
import styles from './charts.module.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CircularProgressBar = ({ progress, size, hours }) => {
  const progressBarChartRef = useRef(null);

  useEffect(() => {
    const chart = progressBarChartRef.current;
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
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false 
      },
    },
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative'
      }}
    >
      <Doughnut ref={progressBarChartRef} data={data} options={options} />
      <div
        style={{
          fontSize: `${size/4.5}px`
        }}
        className={styles.chartLabelWrapper}
      >
        <div 
          style={{
            height: `${hours ? '20px' : ''}`,
          }}
          className={styles.progressIndicator}
        >
          {`${progress}`} <span style={{ fontSize: `${size/7}px` }}>%</span>
        </div>
        {
          hours != null && <div style={{ fontSize: `${size/6}px`, fontWeight: '1000', color: '#c2c2c2ff' }}> {hours} hr </div>
        }
      </div>
    </div>
  );
};

export default CircularProgressBar;