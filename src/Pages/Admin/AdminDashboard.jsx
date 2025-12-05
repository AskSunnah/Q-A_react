// // src/pages/AdminDashboard.jsx
// import React from "react";
// import AdminLayout from "../../Components/Admin/AdminLayout";

// export default function AdminDashboard() {
//   return (

//     <AdminLayout>

//       <style>{`
//         body {
//           margin: 0;
//           font-family: 'Segoe UI', sans-serif;
//         }
//       `}</style>
//       <div className="content" style={{ flex: 1, padding: 32, maxWidth: 800, margin: "0 auto", fontSize: "1.14rem", fontFamily: "Segoe UI, sans-serif" }}>
//         <h2 style={{ color: "#c3a421", fontWeight: 700, marginBottom: 16 }}>Welcome to the Ask Sunnah Admin Dashboard</h2>
//         <p>Select a tab above to get started. From here, you can add new Q&As, edit or manage books, or review all existing entries.</p>
//       </div>
//     </AdminLayout>
//   );
// }


// // src/pages/supervised/Dashboard.jsx
// import React, { useState, useEffect } from "react";
// import AdminLayout from "../../Components/Admin/AdminLayout";
// import { BookOpen, FileText, MessageSquare, CheckCircle } from "lucide-react";

// const StatCard = ({ title, value, breakdown, icon: Icon, color }) => (

//   <div
//     style={{
//       background: "white",
//       borderRadius: "16px",
//       padding: "28px",
//       boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
//       border: "1px solid #eee",
//       flex: 1,
//       minWidth: "260px",
//       display: "flex",
//       alignItems: "center",
//       gap: "20px",
//       transition: "all 0.3s ease",
//     }}
//     onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
//     onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
//   >
//     <div
//       style={{
//         background: color + "20",
//         padding: "18px",
//         borderRadius: "14px",
//       }}
//     >
//       <Icon size={38} color={color} />
//     </div>
//     <div>
//       <p style={{ margin: 0, color: "#666", fontSize: "1rem" }}>{title}</p>
//       <h3
//         style={{
//           margin: "8px 0 0",
//           fontSize: "2.6rem",
//           fontWeight: "800",
//           color: "#222",
//           lineHeight: 1,
//         }}
//       >
//         {value}
//       </h3>
//       {breakdown && (
//         <p style={{ margin: "4px 0 0", color: "#999", fontSize: "0.9rem" }}>
//           {Object.entries(breakdown)
//             .map(([lang, count]) => `${count} ${lang}`)
//             .join(", ")}
//         </p>
//       )}
//     </div>
//   </div>
// );

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalBooks: "Loading...",
//     totalAnswers: "Loading...",
//     pendingQuestions: "Loading...",
//     breakdown: null,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/admin/stats")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch stats");
//         return res.json();
//       })
//       .then((data) => {
//   console.log("Stats data from backend:", data);
//   setStats({
//     totalBooks: data.totalBooks?.books || 0,
//     totalAnswers: data.totalBooks?.answers || 0,
//     pendingQuestions: data.totalBooks?.pendingQuestions || 0,
//     breakdown: {
//       booksEn: data.breakdown?.books?.en || 0,
//       booksAr: data.breakdown?.books?.ar || 0,
//       answersEn: data.breakdown?.answers?.en || 0,
//       answersAr: data.breakdown?.answers?.ar || 0,
//     },
//   });
// })

//       .catch((err) => {
//         console.error("Failed to load stats", err);
//         setStats({
//           totalBooks: "—",
//           totalAnswers: "—",
//           pendingQuestions: "—",
//           breakdown: null,
//         });
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const pendingCount = Number(stats.pendingQuestions) || 0;

//   return (<AdminLayout>
    
//       <style>{`
//         body {
//           margin: 0;
//           font-family: 'Segoe UI', sans-serif;
//         }
//       `}</style>
//     <div
//       style={{
//         padding: "40px 32px",
//         background: "#f8f7f3",
//         minHeight: "100vh",
//       }}
//     >
//       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//         <h1
//           style={{
//             fontSize: "2.4rem",
//             fontWeight: "800",
//             color: "#323232",
//             marginBottom: "12px",
//           }}
//         >
//           Welcome back, Admin </h1>
//         <p style={{ color: "#666", fontSize: "1.15rem", marginBottom: "50px" }}>
//           Here's your content overview at a glance. </p>

//         {/* Stats Cards */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//             gap: "28px",
//             marginBottom: "60px",
//           }}
//         >
//           <StatCard
//             title="Total Books"
//             value={stats.totalBooks}
//             breakdown={{ English: stats.breakdown?.booksEn, Arabic: stats.breakdown?.booksAr }}
//             icon={BookOpen}
//             color="#c3a421"
//           />
//           <StatCard
//             title="Published Q&As"
//             value={stats.totalAnswers}
//             breakdown={{ English: stats.breakdown?.answersEn, Arabic: stats.breakdown?.answersAr }}
//             icon={FileText}
//             color="#16a34a"
//           />
//           <StatCard
//             title="Pending Questions"
//             value={stats.pendingQuestions}
//             icon={pendingCount > 0 ? MessageSquare : CheckCircle}
//             color={pendingCount > 0 ? "#d97706" : "#16a34a"}
//           />
//         </div>

//         {/* Quick Actions */}
//         <div>
//           <h2
//             style={{
//               fontSize: "1.6rem",
//               fontWeight: "700",
//               color: "#444",
//               marginBottom: "24px",
//             }}
//           >
//             Quick Actions
//           </h2>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
//             <button
//               onClick={() => (window.location.href = "/supervised/add-qa")}
//               style={{
//                 padding: "16px 34px",
//                 background: "#c3a421",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "12px",
//                 fontWeight: "600",
//                 fontSize: "1.05rem",
//                 cursor: "pointer",
//                 boxShadow: "0 6px 20px rgba(195,164,33,0.3)",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) => (e.target.style.background = "#b3941c")}
//               onMouseLeave={(e) => (e.target.style.background = "#c3a421")}
//             >
//               Add New Q&A
//             </button>

//             <button
//               onClick={() => (window.location.href = "/supervised/add-book")}
//               style={{
//                 padding: "16px 34px",
//                 background: "#16a34a",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "12px",
//                 fontWeight: "600",
//                 fontSize: "1.05rem",
//                 cursor: "pointer",
//                 boxShadow: "0 6px 20px rgba(22,163,74,0.3)",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) => (e.target.style.background = "#138843")}
//               onMouseLeave={(e) => (e.target.style.background = "#16a34a")}
//             >
//               Add New Book
//             </button>

//             <button
//               onClick={() => (window.location.href = "/supervised/user-questions")}
//               style={{
//                 padding: "16px 34px",
//                 background: pendingCount > 0 ? "#d97706" : "#555",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "12px",
//                 fontWeight: "600",
//                 fontSize: "1.05rem",
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={(e) =>
//                 pendingCount > 0 && (e.target.style.background = "#c56a05")
//               }
//               onMouseLeave={(e) =>
//                 pendingCount > 0 && (e.target.style.background = "#d97706")
//               }
//             >
//               {pendingCount > 0
//                 ? `${pendingCount} Pending Questions`
//                 : "View All Questions"}
//             </button>
//           </div>
//         </div>

//         {/* All caught up message */}
//         {!loading && pendingCount === 0 && (
//           <div
//             style={{
//               marginTop: "60px",
//               padding: "40px",
//               background: "linear-gradient(135deg, #d4edda, #c3e8d5)",
//               borderRadius: "16px",
//               textAlign: "center",
//               color: "#0f5132",
//               fontSize: "1.4rem",
//               fontWeight: "600",
//               boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
//             }}
//           >
//             All caught up! No pending questions right now.
//           </div>
//         )}
//       </div>
//     </div>
//   </AdminLayout>


//   );
// }


// src/pages/supervised/Dashboard.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { BookOpen, FileText, MessageSquare, CheckCircle, Library } from "lucide-react";

const StatCard = ({ title, value, breakdown, icon: Icon, color }) => {
  const isPending = title.includes("Pending");
  const count = isPending ? Number(value) || 0 : 0;

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}20` }}>
        <Icon size={28} color={color} strokeWidth={2.2} />
      </div>
      <div className="stat-info">
        <p className="stat-label">{title}</p>
        <h3 className="stat-number">{value}</h3>
        {breakdown && (
          <p className="stat-detail">
            {Object.entries(breakdown)
              .filter(([, v]) => v > 0)
              .map(([lang, v]) => `${v} ${lang}`)
              .join(" • ")}
          </p>
        )}
      </div>
      {isPending && count > 0 && (
        <div className="pending-tag">{count}</div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: "Loading...",
    totalAnswers: "Loading...",
    pendingQuestions: "Loading...",
    breakdown: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://asksunnah-backend-hno9.onrender.com/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setStats({
          totalBooks: data.totalBooks?.books || 0,
          totalAnswers: data.totalBooks?.answers || 0,
          pendingQuestions: data.totalBooks?.pendingQuestions || 0,
          breakdown: {
            booksEn: data.breakdown?.books?.en || 0,
            booksAr: data.breakdown?.books?.ar || 0,
            answersEn: data.breakdown?.answers?.en || 0,
            answersAr: data.breakdown?.answers?.ar || 0,
          },
        });
      })
      .catch(() => {
        setStats({
          totalBooks: "—",
          totalAnswers: "—",
          pendingQuestions: "—",
          breakdown: null,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = Number(stats.pendingQuestions) || 0;

  return (
    <AdminLayout>
     

      <style jsx>{`
        body { font-family: "Segoe UI", sans-serif; margin: 0; }


        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin: 40px 0;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .stat-icon {
          padding: 14px;
          border-radius: 14px;
          flex-shrink: 0;
        }

        .stat-info { flex: 1; }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 4px 0;
          font-weight: 500;
        }

        .stat-number {
          font-size: 2.125rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
          line-height: 1.1;
        }

        .stat-detail {
          font-size: 0.82rem;
          color: #9ca3af;
          margin: 6px 0 0;
          font-weight: 500;
        }

        .pending-tag {
          position: absolute;
          top: -8px;
          right: 16px;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
        }

        .caught-up {
          max-width: 620px;
          margin: 60px auto 20px;
          padding: 36px 32px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-radius: 16px;
          text-align: center;
          border: 1px solid #a7f3d0;
          box-shadow: 0 8px 25px rgba(0,0,0,0.06);
        }

        .caught-up-icon {
          color: #059669;
          margin-bottom: 12px;
        }

        .caught-up-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #065f46;
          margin: 0;
        }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .container { padding: 24px 16px; }
          .caught-up { padding: 28px 20px; }
        }
      `}</style>

      <div >
        <div >
          <h1>Welcome back, Admin</h1>
          <p>Here's your content overview at a glance.</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            breakdown={{ English: stats.breakdown?.booksEn, Arabic: stats.breakdown?.booksAr }}
            icon={Library}
            color="#c3a421"
          />
          <StatCard
            title="Published Q&As"
            value={stats.totalAnswers}
            breakdown={{ English: stats.breakdown?.answersEn, Arabic: stats.breakdown?.answersAr }}
            icon={FileText}
            color="#16a34a"
          />
          <StatCard
            title="Pending Questions"
            value={stats.pendingQuestions}
            icon={pendingCount > 0 ? MessageSquare : CheckCircle}
            color={pendingCount > 0 ? "#ea580c" : "#6b7280"}
          />
        </div>

        {!loading && pendingCount === 0 && (
          <div className="caught-up">
            <CheckCircle size={42} className="caught-up-icon" />
            <p className="caught-up-text">
              All caught up! No pending questions right now.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}