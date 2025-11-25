import React, { useMemo } from "react";
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
import { useLanguage } from "../../../context/LanguageContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyEarnings = () => {
  const { language } = useLanguage();

  const chartData = useMemo(
    () => ({
      labels:
        language === "ar"
          ? ["أغ", "سب", "أكت", "نوف", "ديس", "ينا"]
          : ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
      datasets: [
        {
          label: language === "ar" ? "الأرباح ($)" : "Earnings ($)",
          data: [3200, 2800, 4100, 3600, 4800, 5200],
          backgroundColor: "#2563eb",
          borderRadius: 6,
        },
      ],
    }),
    [language],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: language === "ar" ? "الأرباح الشهرية" : "Monthly Earnings" },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1000,
            callback: (value) => `${value}`,
          },
        },
      },
    }),
    [language],
  );

  return (
    <div className="card">
      <Bar data={chartData} options={options} />
      <p className="subtitle">{language === "ar" ? "آخر 6 أشهر" : "Last 6 months"}</p>
    </div>
  );
};

export default MonthlyEarnings;
