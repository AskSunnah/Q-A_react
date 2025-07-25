import React from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_TABS = [
  { label: "Add Q&A", route: "/supervised/add-qa" },
  { label: "All Q&As", route: "/supervised/all-qa" },
  { label: "Add a book", route: "/supervised/add-book" },
  { label: "All Books", route: "/supervised/all-books" }
];

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
      body{
      margin: 0;
      font-family: 'Segoe UI', sans-serif;}
        .admin-header {
          background: #287346;
          color: white;
          padding: 18px 28px 14px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          font-size: 1.28rem;
            font-family: 'Segoe UI', sans-serif;
        }
        .admin-header-title {
          font-weight: 600;
          font-size: 1.3rem;
          letter-spacing: 0.02em;
        }
        .admin-header-actions span {
          color: white;
          text-decoration: none;
          font-weight: bold;
          margin-left: 36px;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 1.14rem;
        }
        .admin-header-actions span:hover {
          text-decoration: underline;
        }
        .admin-nav {
          font-family: 'Segoe UI', sans-serif;
          background: #f0f3f2;
          padding: 20px 0 17px 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 35px;
          justify-content: start;
        }
        .admin-nav .dashboard-link {
          text-decoration: none;
          color: #287346;
          font-weight: 700;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 1.14rem;
          padding: 0 7px;
        }
        .admin-nav .dashboard-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .admin-header-actions {
            margin-top: 10px;
          }
          .admin-nav {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
      {/* Green Header */}
      <div className="admin-header">
        <span className="admin-header-title">Ask Sunnah Admin Panel</span>
        <span className="admin-header-actions">
          <span onClick={() => navigate("/supervised/dashboard")}>Dashboard</span>
          <span onClick={handleLogout}>Logout</span>
        </span>
      </div>
      {/* Gray Navigation Tabs */}
      <nav className="admin-nav">
        {ADMIN_TABS.map(tab => (
          <span
            key={tab.route}
            className="dashboard-link"
            onClick={() => navigate(tab.route)}
          >
            {tab.label}
          </span>
        ))}
      </nav>
    </>
  );
}
