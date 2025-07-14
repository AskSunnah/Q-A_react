// src/pages/AllQA.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../Components/Admin/Header";
import { getAllQuestions, deleteQuestion } from "../../api/qa";

export default function AllQA() {
  const [englishQuestions, setEnglishQuestions] = useState([]);
  const [arabicQuestions, setArabicQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([getAllQuestions("en"), getAllQuestions("ar")])
      .then(([eng, ar]) => {
        if (isMounted) {
          setEnglishQuestions(eng);
          setArabicQuestions(ar);
        }
      })
      .catch(() => setMsg("Failed to load questions."))
      .finally(() => setLoading(false));
    return () => { isMounted = false; };
  }, []);

  const handleDelete = async (lang, slug) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuestion(lang, slug);
      setMsg("Deleted successfully.");
      if (lang === "en") setEnglishQuestions(englishQuestions.filter(q => q.slug !== slug));
      else setArabicQuestions(arabicQuestions.filter(q => q.slug !== slug));
    } catch (e) {
      setMsg(e.message || "Delete failed.");
    }
  };

  const handleEdit = (lang, slug) => {
    navigate(`/supervised/add-qa?edit=1&lang=${lang}&slug=${slug}`);
  };

  return (
    <div style={{ background: "#f4f6f8", minHeight: "100vh" }}>
      <AdminHeader />
      <style>{`

        .allqa-container {

         font-family: 'Segoe UI', sans-serif;
          max-width: 920px;
          margin: 2.5rem auto;
          padding: 1.2rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 24px rgba(40,115,70,0.10);
        }
        h1 {
          text-align: center;
          color: #1f6f3e;
          margin-bottom: 2rem;
        }
        h2 {
          color: #287346;
          margin-top: 2.5rem;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          background-color: #fff;
          margin: 0.5rem 0;
          padding: 1rem;
          border-left: 5px solid #287346;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .qa-link {
          color: #1e293b;
          text-decoration: none;
        }
        .qa-link:hover {
          text-decoration: underline;
        }
        .qa-actions button {
          margin-left: 12px;
          font-size: 1em;
          padding: 0.3em 0.8em;
          border-radius: 3px;
          cursor: pointer;
          border: none;
          font-weight: 500;
        }
        .edit-btn {
          background: gray;
          color: white;
        }
        .delete-btn {
          background: #e53e3e;
          color: white;
        }
      `}</style>
      <div className="allqa-container">
        <h1>All Questions (English &amp; Arabic)</h1>
        {msg && <p style={{ color: msg.includes("fail") ? "#c91d1d" : "#287346", textAlign: "center" }}>{msg}</p>}

        <section>
          <h2>English Questions</h2>
          <ul>
            {loading ? <li>Loading...</li> : englishQuestions.length === 0 ? <li>No questions found.</li> : (
              englishQuestions.map((q, i) => (
                <li key={q.slug}>
                  <a className="qa-link" href={`https://asksunnah.com/questions/${q.slug}`} target="_blank" rel="noopener noreferrer">
                    <strong>Q{i + 1}:</strong> {q.heading}
                  </a>
                  <span className="qa-actions">
                    <button className="edit-btn" onClick={() => handleEdit("en", q.slug)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete("en", q.slug)} title="Delete">&#128465;</button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <h2>Arabic Questions</h2>
          <ul>
            {loading ? <li>Loading...</li> : arabicQuestions.length === 0 ? <li>No questions found.</li> : (
              arabicQuestions.map((q, i) => (
                <li style={{ direction: "rtl", textAlign: "right" }} key={q.slug}>
                  <a className="qa-link" href={`https://asksunnah.com/ar/questions/${q.slug}`} target="_blank" rel="noopener noreferrer">
                    <strong>س{i + 1}:</strong> {q.heading}
                  </a>
                  <span className="qa-actions">
                    <button className="edit-btn" onClick={() => handleEdit("ar", q.slug)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete("ar", q.slug)} title="Delete">&#128465;</button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
