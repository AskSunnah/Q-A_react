import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    alert("You have been logged out.");
    navigate("/supervised", { replace: true });
  };

  return (
    <>
      <style>{`
        header {
          background: #287346;
          color: white;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        header a, .dashboard-link {
          color: white;
          text-decoration: none;
          font-weight: bold;
          margin-left: 20px;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 1.05rem;
        }
        @media (max-width: 600px) {
          header {
            flex-direction: column;
            align-items: flex-start;
          }
          header div:last-child {
            margin-top: 10px;
          }
        }
      `}</style>
      <header>
        <div>Ask Sunnah Admin Panel</div>
        <div>
          <span className="dashboard-link" onClick={() => navigate("/supervised/dashboard")}>Dashboard</span>
          <span className="dashboard-link" onClick={handleLogout}>Logout</span>
        </div>
      </header>
    </>
  );
}
