// src/pages/AdminDashboard.jsx
import React from "react";
import AdminHeader from "../../Components/Admin/Header";

export default function AdminDashboard() {
  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh"  }}>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }
      `}</style>
      <AdminHeader />
      <div className="content" style={{ flex: 1, padding: 32, maxWidth: 800, margin: "0 auto", fontSize: "1.14rem",  fontFamily: "Segoe UI, sans-serif" }}>
        <h2 style={{ color: "#287346", fontWeight: 700, marginBottom: 16 }}>Welcome to the Ask Sunnah Admin Dashboard</h2>
        <p>Select a tab above to get started. From here, you can add new Q&As, edit or manage books, or review all existing entries.</p>
      </div>
    </div>
  );
}
