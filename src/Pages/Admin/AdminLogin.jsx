import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminAuth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter both fields");
      return;
    }
    const result = await adminLogin(username, password);
    if (result.success) {
      localStorage.setItem("adminToken", result.token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/supervised/dashboard"), 800);
    } else {
      setMessage(result.message || "Login failed");
    }
  };

  return (
    <div className="admin-login-root">
      {/* INLINE STYLES */}
      <style>{`
        body, .admin-login-root {
          background: #f7f8fa;
          min-height: 100vh;
        }
        .login-card {
          background: #fff;
          max-width: 400px;
          margin: 5rem auto 0 auto;
          border-radius: 2rem;
          box-shadow: 0 6px 32px 0 rgba(40,115,70,0.10), 0 1.5px 6px 0 rgba(40,115,70,0.10);
          padding: 2.5rem 2.5rem 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-card h2 {
          color: #287346;
          font-size: 2.4rem;
          font-weight: bold;
          margin-bottom: 2rem;
        }
        .login-input {
          width: 100%;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid #b5d4c3;
          background: #f1f7ff;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          transition: border 0.2s;
        }
        .login-input:focus {
          border: 1.5px solid #287346;
          outline: none;
          background: #e8f5ea;
        }
        .login-btn {
          width: 70%;
          padding: 0.8rem;
          border-radius: 12px;
          border: none;
          background: #287346;
          color: #fff;
          font-size: 1.3rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 0.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 6px rgba(40,115,70,0.10);
          transition: background 0.2s;
        }
        .login-btn:hover {
          background: #20633a;
        }
        .login-msg {
          height: 22px;
          color: #d32f2f;
          font-size: 1rem;
          margin-top: 0.5rem;
        }
        @media (max-width: 500px) {
          .login-card {
            max-width: 95vw;
            padding: 1.2rem 0.5rem 2rem 0.5rem;
          }
          .login-card h2 {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* LOGIN CARD */}
      <div className="login-card">
        <h2>Admin Login</h2>
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
        />
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
        <div className="login-msg" style={{ color: message.includes('success') ? "#287346" : "#d32f2f" }}>
          {message}
        </div>
      </div>
    </div>
  );
}
