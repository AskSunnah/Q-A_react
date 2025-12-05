// import React, { useState, useEffect } from "react";
// import {
//   getAllQuestions,
//   updateQuestionStatus,
//   deleteQuestion,
// } from "../../api/questions";
// import ConfirmationModal from "../../Components/ConfirmationModal";

// import {
//   MessageSquare,
//   CheckCircle,
//   Clock,
//   Trash2,
//   Globe,
//   User,
//   Calendar,
//   Loader2,
//   Filter,
//   AlertCircle,
// } from "lucide-react";
// import AdminLayout from "../../Components/Admin/AdminLayout";

// export default function UserQuestions() {
//   const [questions, setQuestions] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [language, setLanguage] = useState("en");
//   const [filter, setFilter] = useState("all");
// const [modalOpen, setModalOpen] = useState(false);
// const [modalAction, setModalAction] = useState(null); // function to execute on confirm
// const [modalMessage, setModalMessage] = useState("");

//   const fetchQuestions = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllQuestions(language);
//       const data = res.questions || [];
//       setQuestions(data);
//       applyFilter(data, filter);
//     } catch (err) {
//       alert("Failed to load questions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilter = (data, currentFilter) => {
//     let result = data;
//     if (currentFilter === "unanswered")
//       result = data.filter((q) => q.status !== "answered");
//     else if (currentFilter === "answered")
//       result = data.filter((q) => q.status === "answered");
//     setFiltered(result);
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [language]);

//   useEffect(() => {
//     applyFilter(questions, filter);
//   }, [filter, questions]);

//   const markAsAnswered = async (id) => {
//     if (!window.confirm("Mark this question as answered?")) return;
//     await updateQuestionStatus(id, "answered", language);
//     fetchQuestions();
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Permanently delete this question?")) return;
//     await deleteQuestion(id, language);
//     fetchQuestions();
//   };

//   return (
//     <AdminLayout>
//   <style jsx>{`
//     * {
//       box-sizing: border-box;
//     }
//     body {
//       margin: 0;
//       font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
//         Helvetica, Arial, sans-serif;
//       background: #f1f5f9;
//       color: #334155;
//     }

//     .page-wrapper {
//       min-height: 100vh;
//       padding: 2rem 1rem;
//     }
//     .container {
//       max-width: 1100px;
//       margin: 0 auto;
//     }

//     /* Header */
//     .header {
//       margin-bottom: 2rem;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       flex-wrap: wrap;
//       gap: 1rem;
//     }
//     .title-wrapper {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//     }
//     .title-icon {
//       background: #c3a421;
//       padding: 0.9rem;
//       border-radius: 12px;
//       color: white;
//       box-shadow: 0 4px 12px rgba(195, 164, 33, 0.3);
//     }
//     .title {
//       font-size: 1.85rem;
//       font-weight: 700;
//       color: #1e293b;
//       margin: 0;
//     }
//     .subtitle {
//       font-size: 0.95rem;
//       color: #64748b;
//       margin: 0.25rem 0 0;
//     }

//     /* Language Toggle */
//     .lang-toggle {
//       background: #1e293b;
//       color: white;
//       border: none;
//       padding: 0.75rem 1.25rem;
//       border-radius: 10px;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       transition: all 0.2s ease;
//     }
//     .lang-toggle:hover {
//       background: #334155;
//     }

//     /* Filter Bar */
//     .filter-bar {
//       background: white;
//       padding: 1.25rem 1.5rem;
//       border-radius: 12px;
//       box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//       margin-bottom: 1.5rem;
//       display: flex;
//       align-items: center;
//       gap: 1.5rem;
//       flex-wrap: wrap;
//     }
//     .filter-label {
//       font-weight: 600;
//       color: #475569;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }
//     .filter-buttons {
//       display: flex;
//       gap: 0.75rem;
//       flex-wrap: wrap;
//     }
//     .filter-btn {
//       padding: 0.65rem 1.25rem;
//       border: 1.5px solid #e2e8f0;
//       background: transparent;
//       border-radius: 10px;
//       font-weight: 500;
//       font-size: 0.92rem;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       transition: all 0.2s;
//     }
//     .filter-btn.active {
//       background: #c3a421;
//       color: white;
//       border-color: #c3a421;
//     }
//     .filter-btn:hover:not(.active) {
//       border-color: #c3a421;
//       background: #fffbeb;
//     }
//     .badge {
//       background: rgba(0, 0, 0, 0.1);
//       padding: 0.2rem 0.6rem;
//       border-radius: 20px;
//       font-size: 0.8rem;
//       font-weight: 600;
//     }
//     .badge.active {
//       background: rgba(255, 255, 255, 0.3);
//     }

//     /* Question Card */
//     .card {
//       background: white;
//       border-radius: 14px;
//       padding: 1.75rem;
//       margin-bottom: 1.5rem;
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
//       border: 1px solid #e2e8f0;
//       transition: all 0.25s ease;
//     }
//     .card:hover {
//       transform: translateY(-3px);
//       box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
//     }

//     .card-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: flex-start;
//       margin-bottom: 1.25rem;
//       flex-wrap: wrap;
//       gap: 1rem;
//     }
//     .user-info {
//       display: flex;
//       flex-direction: column;
//       gap: 0.4rem;
//     }
//     .user-name {
//       font-weight: 600;
//       color: #1e293b;
//       font-size: 1.05rem;
//     }
//     .meta {
//       font-size: 0.88rem;
//       color: #64748b;
//       display: flex;
//       align-items: center;
//       gap: 0.4rem;
//     }

//     .question-text {
//       background: #f8fafc;
//       border: 1px solid #e2e8f0;
//       border-left: 4px solid #c3a421;
//       padding: 1.25rem 1.5rem;
//       border-radius: 10px;
//       font-size: 1.05rem;
//       line-height: 1.65;
//       color: #334155;
//       margin: 1rem 0;
//     }

//     /* Status & Actions */
//     .status-actions {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       flex-wrap: wrap;
//     }
//     .status-badge {
//       padding: 0.5rem 1rem;
//       border-radius: 30px;
//       font-size: 0.85rem;
//       font-weight: 600;
//       display: inline-flex;
//       align-items: center;
//       gap: 0.5rem;
//     }
//     .status-answered {
//       background: #d1fae5;
//       color: #065f46;
//     }
//     .status-pending {
//       background: #fef3c7;
//       color: #92400e;
//     }

//     .action-buttons {
//       display: flex;
//       gap: 0.75rem;
//     }
//     .btn-primary {
//       background: #c3a421;
//       color: white;
//       border: none;
//       padding: 0.65rem 1.2rem;
//       border-radius: 10px;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       transition: all 0.2s;
//     }
//     .btn-primary:hover {
//       background: #b0911d;
//       transform: translateY(-1px);
//     }
//     .btn-delete {
//       background: #fef2f2;
//       color: #dc2626;
//       border: 1px solid #fecaca;
//       padding: 0.65rem;
//       border-radius: 10px;
//       cursor: pointer;
//       transition: all 0.2s;
//     }
//     .btn-delete:hover {
//       background: #fee2e2;
//       transform: translateY(-1px);
//     }

//     /* Empty & Loading */
//     .empty-state {
//       text-align: center;
//       padding: 5rem 2rem;
//       color: #64748b;
//     }
//     .empty-icon {
//       width: 90px;
//       height: 90px;
//       background: #e2e8f0;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin: 0 auto 1.5rem;
//     }

//     .skeleton {
//       background: #f1f5f9;
//       border-radius: 8px;
//       animation: pulse 1.8s infinite ease-in-out;
//     }
//     @keyframes pulse {
//       0%, 100% { opacity: 0.6; }
//       50% { opacity: 1; }
//     }
//     .skeleton-line { height: 20px; margin-bottom: 14px; border-radius: 6px; }
//     .skeleton-line.short { width: 70%; }
//   `}</style>

//       <div className="page-wrapper">
//         <div className="container">
//           {/* Header */}
//           <div className="header">
//             <div className="title-wrapper">

//               <div>
//                 <h1 className="title">User Questions</h1>
//                 <p className="subtitle">Manage and respond to user-submitted questions</p>
//               </div>
//             </div>
//             <button className="lang-toggle" onClick={() => setLanguage(l => l === "en" ? "ar" : "en")}>
//               <Globe size={18} />
//               {language === "en" ? "العربية" : "English"}
//             </button>
//           </div>

//           {/* Filter Bar */}
//           <div className="filter-bar">
//             <div className="filter-label">
//               <Filter size={18} />
//               Filter by status:
//             </div>
//             <div className="filter-buttons">
//               <button
//                 className={`filter-btn ${filter === "all" ? "active" : ""}`}
//                 onClick={() => setFilter("all")}
//               >
//                 All <span className={`badge ${filter === "all" ? "active" : ""}`}>{questions.length}</span>
//               </button>
//               <button
//                 className={`filter-btn ${filter === "unanswered" ? "active" : ""}`}
//                 onClick={() => setFilter("unanswered")}
//               >
//                 <Clock size={16} /> Unanswered
//                 <span className={`badge ${filter === "unanswered" ? "active" : ""}`}>
//                   {questions.filter(q => q.status !== "answered").length}
//                 </span>
//               </button>
//               <button
//                 className={`filter-btn ${filter === "answered" ? "active" : ""}`}
//                 onClick={() => setFilter("answered")}
//               >
//                 <CheckCircle size={16} /> Answered
//                 <span className={`badge ${filter === "answered" ? "active" : ""}`}>
//                   {questions.filter(q => q.status === "answered").length}
//                 </span>
//               </button>
//             </div>
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div>
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="card">
//                   <div className="skeleton-line" style={{ width: "35%" }}></div>
//                   <div className="skeleton-line"></div>
//                   <div className="skeleton-line short"></div>
//                   <div className="skeleton-line" style={{ width: "50%", marginTop: "1rem" }}></div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Empty State */}
//           {!loading && filtered.length === 0 && (
//             <div className="empty-state">
//               <div className="empty-icon">
//                 <AlertCircle size={44} color="#94a3b8" />
//               </div>
//               <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
//                 No {filter === "all" ? "" : filter} questions found
//               </h3>
//               <p>{filter === "unanswered" ? "Great job! All questions have been answered." : "Try adjusting your filter."}</p>
//             </div>
//           )}

//           {/* Questions List */}
//           {!loading && filtered.map((q) => (
//             <div key={q._id} className="card">
//               <div className="card-header">
//                 <div className="user-info">
//                   <div className="user-name">
//                     <User size={18} /> {q.name}
//                   </div>
//                   <div className="meta">
//                     <Calendar size={16} />
//                     {new Date(q.createdAt).toLocaleDateString("en-US", {
//                       month: "long",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </div>
//                 </div>
//                 <div className="status-actions">
//                   <span className={`status-badge ${q.status === "answered" ? "status-answered" : "status-pending"}`}>
//                     {q.status === "answered" ? (
//                       <> <CheckCircle size={16} /> Answered </>
//                     ) : (
//                       <> <Clock size={16} /> Pending </>
//                     )}
//                   </span>
//                   <div className="action-buttons">
//                     {q.status !== "answered" && (
//                       <button className="btn-primary" onClick={() => markAsAnswered(q._id)}>
//                         <CheckCircle size={17} /> Mark as Answered
//                       </button>
//                     )}
//                     <button className="btn-delete" onClick={() => handleDelete(q._id)}>
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className="question-text">{q.question}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }

import React, { useState, useEffect } from "react";
import {
    getAllQuestions,
    updateQuestionStatus,
    deleteQuestion,
} from "../../api/questions";
import ConfirmationModal from "../../Components/ConfirmationModal";

import {
    CheckCircle,
    Clock,
    Trash2,
    Globe,
    User,
    Calendar,
    Filter,
    AlertCircle,
    Mail
} from "lucide-react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { useNavigate } from "react-router-dom";   // ← ADD THIS

export default function UserQuestions() {
    const [questions, setQuestions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("en");
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalMessage, setModalMessage] = useState("");

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const res = await getAllQuestions(language);
            const data = res.questions || [];
            setQuestions(data);
            applyFilter(data, filter);
        } catch (err) {
            alert("Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (data, currentFilter) => {
        let result = data;
        if (currentFilter === "unanswered")
            result = data.filter((q) => q.status !== "answered");
        else if (currentFilter === "answered")
            result = data.filter((q) => q.status === "answered");
        setFiltered(result);
    };

    useEffect(() => {
        fetchQuestions();
    }, [language]);

    useEffect(() => {
        applyFilter(questions, filter);
    }, [filter, questions]);

    // Custom modal handler
    const showConfirm = (message, action) => {
        setModalMessage(message);
        setModalAction(() => action);
        setModalOpen(true);
    };

    const handleMarkAsAnswered = (id) => {
        showConfirm("Mark this question as answered?", async () => {
            await updateQuestionStatus(id, "answered", language);
            fetchQuestions();
        });
    };

    const handleDeleteQuestion = (id) => {
        showConfirm("Permanently delete this question?", async () => {
            await deleteQuestion(id, language);
            fetchQuestions();
        });
    };

    return (<AdminLayout>

        <style jsx>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          background: #f1f5f9;
          color: #334155;
        }

        .page-wrapper {
          min-height: 100vh;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Header */
        .header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .title-icon {
          background: #c3a421;
          padding: 0.9rem;
          border-radius: 12px;
          color: white;
          box-shadow: 0 4px 12px rgba(195, 164, 33, 0.3);
        }
        .title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0.25rem 0 0;
        }

        /* Language Toggle */
        .lang-toggle {
          background: #1e293b;
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }
        .lang-toggle:hover {
          background: #334155;
        }

        /* Filter Bar */
        .filter-bar {
          background: white;
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .filter-label {
          font-weight: 600;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .filter-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 0.65rem 1.25rem;
          border: 1.5px solid #e2e8f0;
          background: transparent;
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.92rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: #c3a421;
          color: white;
          border-color: #c3a421;
        }
        .filter-btn:hover:not(.active) {
          border-color: #c3a421;
          background: #fffbeb;
        }
        .badge {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .badge.active {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Question Card */
        .card {
          background: white;
          border-radius: 14px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.25s ease;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .user-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 1.05rem;
        }
        .meta {
          font-size: 0.88rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .question-text {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #c3a421;
          padding: 1.25rem 1.5rem;
          border-radius: 10px;
          font-size: 1.05rem;
          line-height: 1.65;
          color: #334155;
          margin: 1rem 0;
        }

        /* Status & Actions */
        .status-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .status-answered {
          background: #d1fae5;
          color: #065f46;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }
        .btn-primary {
          background: #c3a421;
          color: white;
          border: none;
          padding: 0.65rem 1.2rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background: #b0911d;
          transform: translateY(-1px);
        }
        .btn-delete {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 0.65rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-delete:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }

        /* Empty & Loading */
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          color: #64748b;
        }
        .empty-icon {
          width: 90px;
          height: 90px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .skeleton {
          background: #f1f5f9;
          border-radius: 8px;
          animation: pulse 1.8s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .skeleton-line { height: 20px; margin-bottom: 14px; border-radius: 6px; }
        .skeleton-line.short { width: 70%; }
      `}</style>
        {/* Confirmation Modal */}
        <ConfirmationModal
            open={modalOpen}
            title="Confirmation"
            message={modalMessage}
            onConfirm={() => {
                modalAction && modalAction();
                setModalOpen(false);
            }}
            onCancel={() => setModalOpen(false)}
        />

        <div className="page-wrapper">
            <div className="container">
                {/* Header */}
                <div className="header">
                    <div className="title-wrapper">
                        <div>
                            <h1 className="title">User Questions</h1>
                            <p className="subtitle">
                                Manage and respond to user-submitted questions
                            </p>
                        </div>
                    </div>
                    <button
                        className="lang-toggle"
                        onClick={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
                    >
                        <Globe size={18} />
                        {language === "en" ? "العربية" : "English"}
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-label">
                        <Filter size={18} />
                        Filter by status:
                    </div>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === "all" ? "active" : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            All{" "}
                            <span className={`badge ${filter === "all" ? "active" : ""}`}>
                                {questions.length}
                            </span>
                        </button>
                        <button
                            className={`filter-btn ${filter === "unanswered" ? "active" : ""
                                }`}
                            onClick={() => setFilter("unanswered")}
                        >
                            <Clock size={16} /> Unanswered
                            <span
                                className={`badge ${filter === "unanswered" ? "active" : ""
                                    }`}
                            >
                                {questions.filter((q) => q.status !== "answered").length}
                            </span>
                        </button>
                        <button
                            className={`filter-btn ${filter === "answered" ? "active" : ""}`}
                            onClick={() => setFilter("answered")}
                        >
                            <CheckCircle size={16} /> Answered
                            <span
                                className={`badge ${filter === "answered" ? "active" : ""}`}
                            >
                                {questions.filter((q) => q.status === "answered").length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card">
                                <div className="skeleton-line" style={{ width: "35%" }}></div>
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line short"></div>
                                <div
                                    className="skeleton-line"
                                    style={{ width: "50%", marginTop: "1rem" }}
                                ></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filtered.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <AlertCircle size={44} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                            No {filter === "all" ? "" : filter} questions found
                        </h3>
                        <p>
                            {filter === "unanswered"
                                ? "Great job! All questions have been answered."
                                : "Try adjusting your filter."}
                        </p>
                    </div>
                )}

                {/* Questions List */}
                {!loading &&
                    filtered.map((q) => (
                        <div key={q._id} className="card">
                            <div className="card-header">
                                <div className="user-info">
                                    <div className="user-name">
                                        <User size={18} /> {q.name}
                                    </div>
                                    
                                    <div className="meta">
                                        <Calendar size={16} />
                                        {new Date(q.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </div>

                                      <div className="meta">
        <Mail size={16} />
        {q.email || "No email provided"}
    </div>
                                </div>
                                <div className="status-actions">
                                    <span
                                        className={`status-badge ${q.status === "answered"
                                            ? "status-answered"
                                            : "status-pending"
                                            }`}
                                    >
                                        {q.status === "answered" ? (
                                            <>
                                                {" "}
                                                <CheckCircle size={16} /> Answered{" "}
                                            </>
                                        ) : (
                                            <>
                                                {" "}
                                                <Clock size={16} /> Pending{" "}
                                            </>
                                        )}
                                    </span>
                                    <div className="action-buttons">
                                        {q.status !== "answered" && (
                                            <>
                                                {/* <button
                                                    className="btn-primary"
                                                    onClick={() => handleMarkAsAnswered(q._id)}
                                                >
                                                    <CheckCircle size={17} /> Mark as Answered
                                                </button> */}

                                                {/* NEW: Add Answer Button */}
                                                <button
                                                    className="btn-primary"
                                                    style={{ background: "#16a34a" }}
                                                    onClick={() => {
                                                        const params = new URLSearchParams({
                                                            lang: language,
                                                            question: q.question,
                                                            name: q.name || "Anonymous",
                                                            questionId: q._id,
                                                        });
                                                        navigate(`/supervised/add-qa?${params.toString()}`);
                                                    }}
                                                >
                                                    Add Answer
                                                </button>
                                            </>
                                        )}

                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteQuestion(q._id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="question-text">{q.question}</div>
                        </div>
                    ))}
            </div>
        </div>
    </AdminLayout>


    );
}
