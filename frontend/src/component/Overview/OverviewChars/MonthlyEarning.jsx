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

const MonthlyEarnings = ({ data = [], loading, error }) => {
  const { language } = useLanguage();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels:
          language === "ar"
            ? ["أغ", "سب", "أكت", "نوف", "ديس", "ينا"]
            : ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
        datasets: [
          {
            label: language === "ar" ? "الأرباح ($)" : "Earnings ($)",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: "#2563eb",
            borderRadius: 6,
          },
        ],
      };
    }

    const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthNamesAr = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغ", "سب", "أكت", "نوف", "ديس"];

    const labels = data.map((item) => {
      const index = Math.max(1, Math.min(12, item.month)) - 1;
      return language === "ar" ? monthNamesAr[index] : monthNamesEn[index];
    });

    const values = data.map((item) => Number(item.netProfit || 0));

    return {
      labels,
      datasets: [
        {
          label: language === "ar" ? "صافي الربح ($)" : "Net Profit ($)",
          data: values,
          backgroundColor: "#2563eb",
          borderRadius: 6,
        },
      ],
    };
  }, [data, language]);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: language === "ar" ? "الأرباح الشهرية" : "Monthly Profit" },
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
