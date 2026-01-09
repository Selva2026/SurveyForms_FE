import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function SurveyAnalytics() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [Data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/survey/analytics/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setData(res.data);
      } catch (err) {
        console.log("Analytics error:", err);
      }
    };

    if (id) fetchAnalytics();
  }, [id]);

  if (!Data) return <p className="text-center mt-10">Loading Analytics...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">

      {/* ===== HEADER ===== */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900">
          {Data.title}
        </h1>
        <p className="mt-2 text-lg font-semibold text-gray-700">
          Total Responses: {Data.totalResponses}
        </p>
      </div>

      {/* ===== QUESTIONS ===== */}
      <div className="space-y-10">
        {Data.analytics.map((q, index) => {
          const total = q.data.reduce((sum, d) => sum + d.count, 0);

          return (
            <div
              key={q.questionId}
              className="bg-white border rounded-xl shadow p-6"
            >
              {/* QUESTION TITLE */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Q{index + 1}. {q.questionText}
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Question Type: {q.type.toUpperCase()}
              </p>

              {/* ===== MCQ → PIE CHART ===== */}
              {q.type === "mcq" && (
                <div className="max-w-md mx-auto">
                  <Pie
                    data={{
                      labels: q.data.map(d => d._id),
                      datasets: [
                        {
                          data: q.data.map(d => d.count),
                          backgroundColor: [
                            "#3b82f6",
                            "#22c55e",
                            "#f97316",
                            "#ef4444",
                            "#a855f7",
                            "#14b8a6"
                          ]
                        }
                      ]
                    }}
                    options={{
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (ctx) => {
                              const value = ctx.raw;
                              const percent = (
                                (value / total) * 100
                              ).toFixed(1);
                              return `${value} responses (${percent}%)`;
                            }
                          }
                        },
                        legend: {
                          position: "bottom"
                        }
                      }
                    }}
                  />
                </div>
              )}

              {/* ===== TEXT → BAR CHART ===== */}
              {q.type === "text" && (
                <div className="max-w-md mx-auto">
                  <Bar
                    data={{
                      labels: ["Text Responses"],
                      datasets: [
                        {
                          label: "Responses Count",
                          data: [total],
                          backgroundColor: "#6366f1",
                          borderRadius: 8
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { precision: 0 }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default SurveyAnalytics;
