import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyEarnings = () => {
  const data = {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Earnings ($)",
        data: [3200, 2800, 4100, 3600, 4800, 5200],
        backgroundColor: "#2563eb", // blue-600
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Earnings" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1000 } },
    },
  };

  return (
    <div className="card">
      <Bar data={data} options={options} />
      <p className="subtitle">Last 6 months</p>
    </div>
  );
};

export default MonthlyEarnings;
