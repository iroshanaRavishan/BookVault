import React from "react";
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
  PointElement,
  Tooltip,
  Legend
);

const BarLineChart = () => {

  return (
    <div >
      <Chart type="bar" />
    </div>
  );
};

export default BarLineChart;
