import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";


const socket = io("http://localhost:5001");

function MySurvey() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchMySurveys();
  }, []); 
  
  const fetchMySurveys = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/survey/mysurvey",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSurveys(res.data);

      // 🔥 JOIN SOCKET ROOMS (UNCHANGED)
      res.data.forEach((survey) => {
        socket.emit("joinSurvey", survey._id);
      });

    } catch (err) {
      console.log("Failed to load surveys", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- REAL TIME RESPONSE UPDATE ---------- */
  useEffect(() => {
    socket.on("responseUpdated", ({ surveyId, totalResponses }) => {
      setSurveys((prev) =>
        prev.map((s) =>
          s._id === surveyId
            ? { ...s, totalResponses }
            : s
        )
      );
    });

    return () => {
      socket.off("responseUpdated"); // ✅ FIX
    };
  }, []); // ✅ FIX

  /* ---------- DELETE SURVEY ---------- */
  const deleteSurvey = async (id) => {
    if (!window.confirm("Delete this survey?")) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/survey/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSurveys((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Delete failed",err);
    }
  };

  
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">

      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
        My Surveys
      </h1>

      {surveys.length === 0 && (
        <p className="text-center text-gray-600">
          No surveys created yet
        </p>
      )}

      <div className="grid gap-6">
        {surveys.map((survey) => (
          <div
            key={survey._id}
            className="border rounded p-5 bg-slate-100 shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-bold text-green-900">
                {survey.title}
              </h2>

              <p className="text-gray-700 mt-2">
                {survey.Description || "No description"}
              </p>

              <p className="mt-2 font-semibold text-blue-700">
                Total Responses: {survey.totalResponses || 0}
              </p>
            </div>

            <button
              onClick={() => navigate(`/analytics/${survey._id}`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Analytics
            </button>

            <button
              onClick={() => deleteSurvey(survey._id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MySurvey;
