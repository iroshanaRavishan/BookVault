import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CircularProgressBar = () => {
  const data = {
    labels: ['Progress', 'Remaining'],
  };

  const options = {
    responsive: true,
    cutout: '80%',
    animation: {
      animateRotate: true,
      animateScale: true, 
      duration: 1000,     
    },
  };

  return (
    <div style={{ width: '200px', height: '200px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CircularProgressBar;