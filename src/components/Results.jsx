import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import Header from "./Header";

export default function Results() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const latestResultFromState = location.state?.latestResult;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/api/results/", { headers: { Authorization: `Token ${token}` } })
      .then((res) => {
        if (latestResultFromState) {
          setResults([
            latestResultFromState,
            ...res.data.filter((r) => r.id !== latestResultFromState.id),
          ]);
        } else {
          setResults(res.data);
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate, latestResultFromState]);

  if (results.length === 0) return <p>Loading results...</p>;

  return (
    <>
      <Header />
      <div className="container">
        <h2 className="page-title">Your Results</h2>
        {results.map((r) => (
          <div key={r.id} className="result-box">
            <h3 className="result-category">{r.category}</h3>
            <div className="score">Score: {r.score}%</div>
            <div className="result-date">Taken at: {new Date(r.taken_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </>
  );
}
