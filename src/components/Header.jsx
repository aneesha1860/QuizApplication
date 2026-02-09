import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Header() {
    const [username, setUsername] = useState("Guest");
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        api.get("/api/results/", { headers: { Authorization: `Token ${token}` } })
        .then(res => {
            if (res.data.length > 0) {
                setUsername(res.data[0].user);
            } else {
                const storedUsername = localStorage.getItem("username");
                if (storedUsername) {
                    setUsername(storedUsername);
                } else {
                    setUsername("User");
                }
            }
        })
        .catch(() => {
            const storedUsername = localStorage.getItem("username");
            setUsername(storedUsername || "User");
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        localStorage.removeItem("username"); 
        navigate("/login");
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="app-title">QuizMaster</h1>
            </div>
            <div className="header-right">
                <span className="welcome">Welcome, {username}</span>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}
