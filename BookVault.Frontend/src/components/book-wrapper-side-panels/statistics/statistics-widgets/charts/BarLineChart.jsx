import React, { useEffect, useRef, useState } from "react";
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
import { FaArrowRightLong, FaArrowUpLong, FaTrophy } from "react-icons/fa6";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const BarLineChart = ({ 
  showLine,
  width,
  height,
  values, 
  labels, 
  barThicknessVal=13,
  targetLineValue = 4.5 }) => {
  const barLineChartRef = useRef(null);
  const [iconPosition, setIconPosition] = useState(null);

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        data: values,
        borderWidth: 0,
        borderRadius: 2,
        barThickness: barThicknessVal,
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
      // Only show line chart if showLine is true
      showLine && {
        type: "line",
        data: values,
        borderColor: "#f18f8fff",
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: "#f18f8fff",
        tension: 0.7,
        fill: false,
      },
    ].filter(Boolean),
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

  const hoverLinesPlugin =    {
    id: "hoverLine",
    beforeDatasetsDraw(chartInstance) {
      const activeElements = chartInstance.tooltip?.getActiveElements?.() || [];
      if (activeElements.length === 0) return;

      const ctx = chartInstance.ctx;
      const { chartArea } = chartInstance;

      const y = activeElements[0].element.y;

      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "#999";

      ctx.beginPath();
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.stroke();

      ctx.restore();
    }
  };

  const staticYLinePlugin = !showLine
    ? {
        id: "staticYLine",
        beforeDatasetsDraw(chartInstance) {
          const { ctx, chartArea, scales } = chartInstance;
          const y = scales.y.getPixelForValue(targetLineValue);

          ctx.save();
          ctx.strokeStyle = "#0000004d";
          ctx.lineWidth = 1;
          ctx.setLineDash([2]);
          ctx.beginPath();
          ctx.moveTo(chartArea.left, y);
          ctx.lineTo(chartArea.right, y);
          ctx.stroke();
          ctx.restore();
        },

        afterDatasetsDraw(chartInstance) {
          const { ctx, chartArea, scales } = chartInstance;
          const y = scales.y.getPixelForValue(targetLineValue);

          ctx.save();
          ctx.font = "bold 10px sans-serif"; 
          ctx.fillStyle = "#333";
        
          const text = `${targetLineValue} hrs`;
          const textX = chartArea.right - 56;
          const textY = y - 2;

          ctx.fillText(text, textX, textY);
          chartInstance.$staticLine = {};
        },
      }
    : null;

  useEffect(() => {
    const chart = barLineChartRef.current;
    if (!chart) return;

    const instance = chart.chartInstance || chart;

    const interval = setInterval(() => {
      if (instance.$staticLine) {
        setIconPosition({
          x: instance.$staticLine.x,
          y: instance.$staticLine.y,
        });
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [targetLineValue]);

  return (
    <div className={styles.chartContainer} style={{ width: width, height: height }}>
      <span className={styles.chartIndicator} style={{ transform: width == '200px'? 'translateX(50%)': 'translateX(100%)' }} >
        Hours <FaArrowUpLong />
        Date <FaArrowRightLong style={{ marginTop: "2px" }} />
      </span>

      <div className={styles.chartWrapper} >
        <Chart key={targetLineValue} ref={barLineChartRef} type="bar" data={data} options={options} plugins={[hoverLinesPlugin]}/>
      </div>
    </div>
  );
};

export default BarLineChart;
