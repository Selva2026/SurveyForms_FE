import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ParticipateSurvey() {
  const { id } = useParams(); // surveyId
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchSurvey();
  }, );

 
  const fetchSurvey = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/survey/part/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSurvey(res.data);
    } catch (error) {
      alert("Survey not found");
      console.log(error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  
  const handleTextAnswer = (qId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: value
    }));
  };

  const handleMCQAnswer = (qId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: option
    }));
  };

  
  const submitSurvey = async () => {
    try {
      await axios.post(
        `http://localhost:5001/api/survey/submit`,
        {
          surveyId: id,
          answers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Survey submitted successfully");
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    }
  };

  
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!survey) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">

      <h1 className="text-3xl font-bold text-center mb-4">
        {survey.title}
      </h1>

      <p className="text-center text-gray-600 mb-8">
        {survey.Description}
      </p>

      {survey.questions.map((q, index) => (
        <div key={q._id} className="mb-6">
          <h3 className="font-semibold text-lg">
            {index + 1}. {q.questiontext}
          </h3>

          {/* TEXT QUESTION */}
          {q.type === "text" && (
            <input
              type="text"
              className="mt-2 w-full border rounded px-3 py-2"
              placeholder="Type your answer"
              value={answers[q._id] || ""}
              onChange={(e) =>
                handleTextAnswer(q._id, e.target.value)
              }
            />
          )}

          {/* MCQ QUESTION */}
          {q.type === "mcq" && (
            <div className="mt-2 flex flex-col gap-2">
              {q.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={() =>
                      handleMCQAnswer(q._id, opt)
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="text-center mt-8">
        <button
          onClick={submitSurvey}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Survey
        </button>
      </div>
    </div>
  );
}

export default ParticipateSurvey;
