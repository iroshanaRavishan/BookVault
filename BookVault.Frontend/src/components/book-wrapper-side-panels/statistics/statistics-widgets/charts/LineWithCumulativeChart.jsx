import React, { useRef } from "react";
import styles from './charts.module.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { FaArrowRightLong, FaArrowUpLong } from "react-icons/fa6";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

const LineWithCumulativeChart = () => {
  const cumulativeChartRef = useRef(null);
  const values = [2.5, 4.1, 1.6, 2.2, 3, 2.4, 4.5];

  const cumulative = values.map(
    (sum => value => sum += value)(0)
  );

  const labels = ["12", "13", "14", "15", "16", "17", "18"];

  const maxValue = Math.max(...cumulative);
  const suggestedMax = Math.ceil(maxValue / 5) * 5;

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: "#f18f8fff",
        backgroundColor: "rgba(255, 77, 77, 0.3)",
        borderWidth: 1,
        pointRadius: 3,
        fill: true,
      },
      {
        data: cumulative,
        borderColor: "#0026fdff",
        tension: 0.7,
        borderWidth: 1,
        pointRadius: 3,
        fill: true,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { 
        ticks: { 
          color: "#666",
          font: {
              size: 8,
          } , 
        },
        grid: { display: false }
     },
      y: {
        beginAtZero: true,
        suggestedMax,
        ticks: { 
            stepSize: 5,
            color: "#666",
            font: {
                size: 8,
            },
        },
        grid: { color: "#eee" },
      },
    },
  };

  const hoverLinesPlugin = {
    id: "hoverLines",
  };

  return (
    <div className={styles.chartContainer} style={{ width: '200px', height: '100px' }}>
      <span className={styles.chartIndicator} style={{ transform: 'translateX(50%)' }}>
        Hours <FaArrowUpLong />
        Date  <FaArrowRightLong style={{marginTop: '2px'}} /> 
      </span>
      <Chart ref={cumulativeChartRef} type="line" />      
    </div>
  );
};

export default LineWithCumulativeChart;
