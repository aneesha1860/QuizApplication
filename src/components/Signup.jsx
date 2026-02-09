import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Header from "./Header";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/signup/", { username, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            navigate("/"); 
        } 
        catch (err) {
            alert(err.response?.data?.error || "Signup failed");
            console.error(err);
        }
    };

    return (
    <>
      <Header />
      <div className="container auth-container">
        <h2 className="form-title">Create an Account</h2>
        <form onSubmit={handleSignup} className="login-form">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
            />
            <button type="submit" className="login-btn">
                Sign Up
            </button>
        </form>
        <p className="signup-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </>
  );
}
