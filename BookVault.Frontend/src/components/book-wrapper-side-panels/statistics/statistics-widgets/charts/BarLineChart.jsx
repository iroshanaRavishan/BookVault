import React, { useRef, useEffect } from "react";
import styles from './charts.module.css';
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
  const barLineChartRef = useRef(null);

  const labels = ["12", "13", "14", "15", "16", "17", "18"];

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        data: [2.5, 4.1, 1.6, 2.2, 3, 2.4, 4.5],
        borderWidth: 0,
        borderRadius: 2,
        barThickness: 13,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return "#4CAF50";

          const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "#f18f8fff");
          gradient.addColorStop(1, "#0026fdff");
          return gradient;
        },
      },
      {
        type: "line",
        data: [2.5, 4.1, 1.6, 2.2, 3, 2.4, 4.5],
        borderColor: "#f18f8fff",
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: "#f18f8fff",
        tension: 0.7,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: {
            size: 8
          },
          color: "#666",
        },
      },
      y: {
        grid: { color: "#eee" },
        beginAtZero: true,
        ticks: { 
          color: "#666",
          font: {
            size: 8
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      },
    },
  };


  return (
    <div className={styles.chartContainer}>
      <Chart ref={barLineChartRef} type="bar" data={data} options={options} />
    </div>
  );
};

export default BarLineChart;
