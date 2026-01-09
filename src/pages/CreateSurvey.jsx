import React, { useState } from "react";
import axios from "axios";


function CreateSurvey() {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredTitle, setHoveredTitle] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------- ADD / REMOVE QUESTION ----------
  const addQuestion = (index) => {
    const newQuestion = {
      questiontext: "Untitled Question",
      type: "text",
      options: [],
    };
    setQuestions((prev) => [
      ...prev.slice(0, index),
      newQuestion,
      ...prev.slice(index),
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- UPDATE QUESTION ----------
  const updateQuestionText = (index, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, questiontext: value } : q))
    );
  };

  const updateQuestionType = (index, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? { ...q, type: value, options: value === "mcq" ? q.options : [] }
          : q
      )
    );
  };

  const addOption = (qIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const updateOption = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === optIndex ? value : opt)),
            }
          : q
      )
    );
  };

  const removeOption = (qIndex, optIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.filter((_, j) => j !== optIndex) }
          : q
      )
    );
  };

  // ---------- PUBLISH SURVEY ----------
  const publishSurvey = async () => {
    if (!title.trim()) return alert("Survey title is required");
    if (questions.length === 0) return alert("Add at least one question");

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login again");

    setLoading(true);

    try {
     
      const payload = {
        title,
        Description: description,
        questions: questions.map((q) => ({
          questiontext: q.questiontext?.trim() || "Untitled Question",
          type: q.type || "text",
          options: q.type === "mcq" ? q.options || [] : [],
        })),
      };

      const res = await axios.post(
        "http://localhost:5001/api/survey/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Survey published successfully");
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
    <div className="flex mx-50 flex-col mt-20 items-center gap-6">
      {/* TITLE */}
      <div
        className="flex gap-2  items-center"
        onMouseEnter={() => setHoveredTitle(true)}
        onMouseLeave={() => setHoveredTitle(false)}
      >
        <input
          className="text-4xl text-center font-bold w-[700px] border-2 border-blue-500 bg-slate-200 rounded h-[60px]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {hoveredTitle && (
          <div className="border-2 rounded h-[60px] w-10 flex items-center justify-center">
            <img
              src="/Add.png"
              alt="add"
              className="w-7 h-7 cursor-pointer"
              onClick={() => addQuestion(0)}
            />
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <textarea
        className="w-[700px] border h-8 rounded p-2"
        placeholder="Survey description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* QUESTIONS */}
      {questions.map((q, index) => (
        <div
          key={index}
          className="flex gap-4"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="border-2 border-blue-500 bg-slate-200 rounded p-4 w-[700px]">
            <input
              className="text-xl font-bold w-full bg-transparent outline-none"
              value={q.questiontext}
              onChange={(e) => updateQuestionText(index, e.target.value)}
            />
            <select
              className="mt-3 border rounded px-2 py-1"
              value={q.type}
              onChange={(e) => updateQuestionType(index, e.target.value)}
            >
              <option value="text">Text</option>
              <option value="mcq">MCQ</option>
            </select>

            {q.type === "mcq" && (
              <div className="mt-3 flex flex-col gap-2">
                {q.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={opt}
                      onChange={(e) => updateOption(index, i, e.target.value)}
                    />
                    <button
                      className="text-red-500"
                      onClick={() => removeOption(index, i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="text-blue-600 text-sm self-start"
                  onClick={() => addOption(index)}
                >
                  + Add option
                </button>
              </div>
            )}
          </div>

          {hoveredIndex === index && (
            <div className="border-2 rounded w-10 flex flex-col items-center justify-center h-[60px]">
              <img
                src="/Add.png"
                className="w-7 h-7 cursor-pointer"
                onClick={() => addQuestion(index + 1)}
              />
              <img
                src="/Remove.png"
                className="w-7 h-7 cursor-pointer"
                onClick={() => removeQuestion(index)}
              />
            </div>
          )}
        </div>
      ))}

      {/* PUBLISH BUTTON */}
      <button
        onClick={publishSurvey}
        disabled={loading}
        className="mt-10 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Survey"}
      </button>
    </div>
    </div>
  );
}

export default CreateSurvey;
