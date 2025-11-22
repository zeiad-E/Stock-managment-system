import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDistribution = () => {
  const data = {
    labels: ["Design", "Development"],
    datasets: [
      {
        data: [40, 60],
        backgroundColor: ["#8b5cf6", "#06b6d4"], // purple-500, cyan-500
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: { usePointStyle: true },
      },
      title: {
        display: true,
        text: "Task Distribution",
      },
    },
  };

  return (
    <div className="card">
      <Pie data={data} options={options} />
      <p className="subtitle">Current month</p>
    </div>
  );
};

export default TaskDistribution;
