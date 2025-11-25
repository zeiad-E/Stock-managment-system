import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useLanguage } from "../../../context/LanguageContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDistribution = () => {
  const { language } = useLanguage();

  const data = useMemo(
    () => ({
      labels: language === "ar" ? ["التصميم", "التطوير"] : ["Design", "Development"],
      datasets: [
        {
          data: [40, 60],
          backgroundColor: ["#8b5cf6", "#06b6d4"],
          borderWidth: 1,
        },
      ],
    }),
    [language],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          labels: { usePointStyle: true },
        },
        title: {
          display: true,
          text: language === "ar" ? "توزيع المهام" : "Task Distribution",
        },
      },
    }),
    [language],
  );

  return (
    <div className="card">
      <Pie data={data} options={options} />
      <p className="subtitle">{language === "ar" ? "الشهر الحالي" : "Current month"}</p>
    </div>
  );
};

export default TaskDistribution;
