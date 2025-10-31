import React, { useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const BarLineChart = () => {
  const chartRef = useRef(null);

  const labels = ["12", "13", "14", "15", "16", "17", "18"];

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
  };


  return (
    <div >
      <Chart type="bar" options={options} />
    </div>
  );
};

export default BarLineChart;
