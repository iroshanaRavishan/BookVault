import React, { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CircularProgressBar = ({ progress }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;
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
    <div style={{ width: '200px', height: '200px' }}>
      <Doughnut ref={chartRef} data={data} options={options} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2px',
          position: 'absolute',
          top: '50%',
          left: '50%',
        }}
      >
        {`${progress}`} %
      </div>
    </div>
  );
};

export default CircularProgressBar;