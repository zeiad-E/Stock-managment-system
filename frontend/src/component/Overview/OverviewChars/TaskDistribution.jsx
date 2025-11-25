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

const TaskDistribution = ({ data = [], loading, error }) => {
  const { language } = useLanguage();

  const chartData = useMemo(() => {
    let sales = 0;
    let purchases = 0;

    if (Array.isArray(data) && data.length > 0) {
      const latest = data[data.length - 1];
      sales = Number(latest.totalRevenue || 0);
      purchases = Number(latest.totalCost || 0);
    }

    if (sales === 0 && purchases === 0) {
      sales = 1;
      purchases = 1;
    }

    return {
      labels: language === "ar" ? ["المبيعات", "المشتريات"] : ["Sales", "Purchases"],
      datasets: [
        {
          data: [sales, purchases],
          backgroundColor: ["#8b5cf6", "#06b6d4"],
          borderWidth: 1,
        },
      ],
    };
  }, [data, language]);

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
          text: language === "ar" ? "نسبة المبيعات إلى المشتريات" : "Sales vs Purchases",
        },
      },
    }),
    [language],
  );

  return (
    <div className="card">
      <Pie data={chartData} options={options} />
      <p className="subtitle">{language === "ar" ? "الشهر الحالي" : "Current month"}</p>
    </div>
  );
};

export default TaskDistribution;
