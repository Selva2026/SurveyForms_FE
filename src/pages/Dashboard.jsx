import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchSurveys();
  }, );

  const fetchSurveys = async () => {
    try {
      const res = await axios.get(
        "https://surveyforms-be.onrender.com/api/survey/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSurveys(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

 {/* LEFT SIDEBAR */}
 <div className=" h-dvh border-r-2 w-1/4 border-blue-900 p-4">
        <h1 className="text-center text-2xl font-bold text-green-900 underline">
          Dashboard
        </h1>

        <div className="flex justify-center  mt-10">
          <button
            onClick={() => navigate("/create")}
            className="border-2 cursor-pointer w-44 p-2 rounded bg-blue-900 text-white font-bold"
          >
            CREATE SURVEY
          </button>
        </div>
        <div className="flex justify-center  mt-10">
          <button
            onClick={() => navigate("/mysurvey")}
            className="border-2 p-2 cursor-pointer w-44 rounded bg-blue-900 text-white font-bold"
          >
            MY SURVEYS
          </button>
        </div>
      </div>
    
      

      {/* CENTER CONTENT */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl border bg-green-400 p-2 text-white font-bold mb-6 text-center">
          Available Surveys
        </h2>

        {loading && <p className="text-center">Loading surveys...</p>}

        {!loading && surveys.length === 0 && (
          <p className="text-center  text-gray-600">
            No surveys available
          </p>
        )}

        <div className="grid grid-cols-1  text-center md:grid-cols-2 gap-6">
          {surveys.map((survey) => (
           
            <div
              key={survey._id}
              className="border flex gap-8 items-center w-120 h-32 justify-center rounded-lg p-4 shadow"
            >
               <div>
              <h3 className="text-xl font-bold">
                {survey.title}
              </h3>

              <p className="text-gray-600 mt-2">
                {survey.Description}
              </p>

              <p className="text-sm mt-2">
                Created by: <b>{survey.User?.name}</b>
              </p>
</div>
              <button
                onClick={() =>
                  navigate(`/survey/${survey._id}`)
                }
                className="mt-4 bg-green-600 text-white h-12 px-4 py-2 rounded hover:bg-green-700"
              >
                Participate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

