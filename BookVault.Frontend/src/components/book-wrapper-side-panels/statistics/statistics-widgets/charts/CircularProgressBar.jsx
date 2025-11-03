import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CircularProgressBar = () => {
  const chartRef = useRef(null);

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
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CircularProgressBar;