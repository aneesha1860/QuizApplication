import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "./Header";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("");
  const [answers, setAnswers] = useState({}); 
  const [feedback, setFeedback] = useState({}); 
  const [currentIndex, setCurrentIndex] = useState(0);

  const optionMap = {
    option_a: "A",
    option_b: "B",
    option_c: "C",
    option_d: "D",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    api.get(`/api/questions/${id}/`, { headers: { Authorization: `Token ${token}` } })
      .then((res) => {
        setCategory(res.data.category);
        setQuestions(res.data.questions);
      })
      .catch(() => navigate("/login"));
  }, [id, navigate]);

  if (questions.length === 0) return <p>Loading questions...</p>;

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionKey) => {
    const selectedLetter = optionMap[optionKey];

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedLetter }));

    if (selectedLetter === currentQuestion.correct_option) {
      setFeedback((prev) => ({ ...prev, [currentQuestion.id]: { text: "Correct!", type: "correct" } }));
    } else {
      setFeedback((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          text: `Wrong! Correct answer: ${currentQuestion.correct_option}`,
          type: "wrong",
        },
      }));
    }
  };

  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const token = localStorage.getItem("token");
      try {
        const res = await api.post(
          `/api/submit/${id}/`,
          { answers },
          { headers: { Authorization: `Token ${token}` } }
        );
        navigate("/results", { state: { latestResult: res.data } });
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const getOptionClass = (optionKey) => {
    const letter = optionMap[optionKey];
    const selected = answers[currentQuestion.id];
    const correct = currentQuestion.correct_option;

    if (!selected) return "option-btn";

    if (letter === selected) {
      return letter === correct ? "option-btn correct" : "option-btn wrong";
    }

    if (letter === correct && selected !== correct) {
      return "option-btn correct";
    }

    return "option-btn";
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>{category} Quiz</h2>
        <div className="question-box">
          <div className="question-text">{currentQuestion.question}</div>

          <div className="options">
            {["option_a", "option_b", "option_c", "option_d"].map((key) => (
              <button
                key={key}
                className={getOptionClass(key)}
                onClick={() => handleSelect(key)}
                disabled={!!answers[currentQuestion.id]} 
              >
                {currentQuestion[key]}
              </button>
            ))}
          </div>

          {feedback[currentQuestion.id] && (
            <p className={`feedback ${feedback[currentQuestion.id].type}`}>
              {feedback[currentQuestion.id].text}
            </p>
          )}

          <div className="navigation-buttons">
            <button onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </button>
            <button onClick={handleNext}>
              {currentIndex + 1 === questions.length ? "Submit" : "Next"}
            </button>
          </div>

          <p>
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
      </div>
    </>
  );
}
