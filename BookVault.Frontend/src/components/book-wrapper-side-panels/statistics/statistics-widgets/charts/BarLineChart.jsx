import React from "react";
import { Chart as ChartJS, BarElement,
  LineElement,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

const BarLineChart = () => {

  return (
    <div >
      <Chart type="bar" />
    </div>
  );
};

export default BarLineChart;
