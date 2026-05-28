import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../Components/Admin/Header";
import { getAllQuestions, deleteQuestion } from "../../api/qa";
import AdminLayout from "../../Components/Admin/AdminLayout";

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
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (lang, slug) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await deleteQuestion(lang, slug);
      setMsg("Deleted successfully.");
      if (lang === "en")
        setEnglishQuestions(englishQuestions.filter((q) => q.slug !== slug));
      else setArabicQuestions(arabicQuestions.filter((q) => q.slug !== slug));
    } catch (e) {
      setMsg(e.message || "Delete failed.");
    }
  };

  const handleEdit = (lang, slug) => {
    navigate(`/supervised/add-qa?edit=1&lang=${lang}&slug=${slug}`);
  };

  // Shared classes that mirror the original CSS
  // li: background:#fff, margin:0.5rem 0, padding:1rem, borderLeft:5px solid var(--bg-color-header),
  //     borderRadius:4px, boxShadow, display:flex, justifyContent:space-between, alignItems:center
  const liCls =
    "bg-white my-2 p-4 border-l-[5px] border-[var(--bg-color-header)] rounded-[4px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] flex justify-between items-center";

  return (
    <AdminLayout>
      <style>{`
        body { margin: 0; font-family: 'Segoe UI', sans-serif; }
      `}</style>

      {/*
        .allqa-container:
          font-family:'Segoe UI', max-width:920px, margin:2.5rem auto,
          padding:1.2rem, background:#fff, border-radius:12px,
          box-shadow:0 6px 24px rgba(40,115,70,0.10)
      */}
      <div className="font-[Segoe_UI,sans-serif] max-w-[920px] mx-auto mt-10 p-5 bg-white rounded-xl shadow-[0_6px_24px_rgba(40,115,70,0.10)]">
        {/* h1: text-align:center, color:var(--bg-color-header), margin-bottom:2rem */}
        <h1 className="text-center text-[var(--bg-color-header)] mb-8 text-2xl font-bold">
          All Questions (English &amp; Arabic)
        </h1>

        {msg && (
          <p
            className="text-center"
            style={{ color: msg.includes("fail") ? "#c91d1d" : "#287346" }}
          >
            {msg}
          </p>
        )}

        {/* English section */}
        <section>
          {/* h2: color:var(--bg-color-header), margin-top:2.5rem */}
          <h2 className="text-[var(--bg-color-header)] mt-10 text-xl font-bold">
            English Questions
          </h2>
          <ul className="list-none p-0">
            {loading ? (
              <li className={liCls}>Loading...</li>
            ) : englishQuestions.length === 0 ? (
              <li className={liCls}>No questions found.</li>
            ) : (
              englishQuestions.map((q, i) => (
                <li key={q.slug} className={liCls}>
                  {/* .qa-link: color:#1e293b, text-decoration:none; hover:underline */}
                  <a
                    className="text-[#1e293b] no-underline hover:underline"
                    href={`https://asksunnah.com/questions/${q.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>Q{i + 1}:</strong> {q.heading}
                  </a>
                  {/*
                    .qa-actions button:
                      margin-left:12px, font-size:1em, padding:0.3em 0.8em,
                      border-radius:3px, cursor:pointer, border:none, font-weight:500
                  */}
                  <span className="flex items-center">
                    {/* .edit-btn: background:gray, color:white */}
                    <button
                      className="ml-3 text-[1em] py-[0.3em] px-[0.8em] rounded-[3px] cursor-pointer border-none font-medium bg-gray-500 text-white"
                      onClick={() => handleEdit("en", q.slug)}
                    >
                      Edit
                    </button>
                    {/* .delete-btn: background:#e53e3e, color:white */}
                    <button
                      className="ml-3 text-[1em] py-[0.3em] px-[0.8em] rounded-[3px] cursor-pointer border-none font-medium bg-[#e53e3e] text-white"
                      onClick={() => handleDelete("en", q.slug)}
                      title="Delete"
                    >
                      &#128465;
                    </button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Arabic section */}
        <section>
          <h2 className="text-[var(--bg-color-header)] mt-10 text-xl font-bold">
            Arabic Questions
          </h2>
          <ul className="list-none p-0">
            {loading ? (
              <li className={liCls}>Loading...</li>
            ) : arabicQuestions.length === 0 ? (
              <li className={liCls}>No questions found.</li>
            ) : (
              arabicQuestions.map((q, i) => (
                <li key={q.slug} className={liCls}>
                  <a
                    className="text-[#1e293b] no-underline hover:underline"
                    href={`https://asksunnah.com/ar/questions/${q.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>س{i + 1}:</strong> {q.heading}
                  </a>
                  <span className="flex items-center">
                    <button
                      className="ml-3 text-[1em] py-[0.3em] px-[0.8em] rounded-[3px] cursor-pointer border-none font-medium bg-gray-500 text-white"
                      onClick={() => handleEdit("ar", q.slug)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-3 text-[1em] py-[0.3em] px-[0.8em] rounded-[3px] cursor-pointer border-none font-medium bg-[#e53e3e] text-white"
                      onClick={() => handleDelete("ar", q.slug)}
                      title="Delete"
                    >
                      &#128465;
                    </button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </AdminLayout>
  );
}
