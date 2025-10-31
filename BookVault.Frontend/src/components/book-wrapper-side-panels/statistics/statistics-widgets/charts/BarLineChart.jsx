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

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        data: [19, 9, 5, 11, 7, 13, 10],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };


  return (
    <div >
      <Chart type="bar" data={data} options={options} />
    </div>
  );
};

export default BarLineChart;
