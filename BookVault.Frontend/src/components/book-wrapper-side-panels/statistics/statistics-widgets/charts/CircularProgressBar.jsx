import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const CircularProgressBar = () => {
  return (
    <div style={{ width: '200px', height: '200px' }}>
      <Doughnut />
    </div>
  );
};

export default CircularProgressBar;