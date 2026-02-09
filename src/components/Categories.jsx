import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "./Header";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/api/categories/", { headers: { Authorization: `Token ${token}` } })
      .then((res) => setCategories(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (categories.length === 0) return <p>Loading categories...</p>;

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="page-title">Select a Quiz</h1>
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/quiz/${cat.id}`)}
            >
              <h3 className="category-name">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
