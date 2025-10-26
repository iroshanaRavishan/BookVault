import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const CircularProgressBar = () => {
  return (
    <div style={{ width: '200px', height: '200px' }}>
      <Doughnut />
    </div>
  );
};

export default CircularProgressBar;