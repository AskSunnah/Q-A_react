// src/pages/AllBooks.jsx
import React, { useState, useEffect } from "react";
import AdminHeader from "../../Components/Admin/Header";
import { fetchBooksAdmin, deleteBookAdmin } from "../../api/adminBook"; // implement these
import { useNavigate } from "react-router-dom";

const LANGS = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" }
];

export default function AllBooks() {
  const [lang, setLang] = useState("en");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "", onYes: null });
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchBooksAdmin(lang)
      .then(setBooks)
      .catch(err => setModal({ show: true, title: "Error", message: err.message }))
      .finally(() => setLoading(false));
  }, [lang]);

  // --- Actions ---
  const confirmDelete = (slug) => {
    setModal({
      show: true,
      title: "Delete Book",
      message: "Are you sure you want to delete this book?",
      onYes: () => doDelete(slug)
    });
  };
  const doDelete = async (slug) => {
    setModal({ show: false });
    setLoading(true);
    try {
      await deleteBookAdmin(lang, slug);
      setBooks(books.filter(b => b.slug !== slug));
    } catch (err) {
      setModal({ show: true, title: "Error", message: err.message });
    }
    setLoading(false);
  };

  // --- Render ---
  return (
    <div style={{ background: "#f4f6f8", minHeight: "100vh" }}>
      <AdminHeader />
      <div style={{ maxWidth: 900, margin: "2rem auto" }}>
        <h1 style={{ textAlign: "center", color: "#1f6f3e" }}>Manage Books</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
          {LANGS.map(l => (
            <button
              key={l.value}
              style={{
                padding: "0.5rem 1.2rem",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                background: lang === l.value ? "#287346" : "#e2e8f0",
                color: lang === l.value ? "white" : "#1e293b"
              }}
              onClick={() => setLang(l.value)}
            >
              {l.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: "center" }}>Loading books...</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, maxWidth: 700, margin: "0 auto" }}>
            {books.length === 0 ? (
              <li>No books found in {lang === "en" ? "English" : "Arabic"}.</li>
            ) : (
              books.map(book => (
                <li key={book.slug}
                  style={{
                    background: "#fff",
                    margin: "0.5rem 0",
                    padding: "1rem",
                    borderLeft: "5px solid #287346",
                    borderRadius: 6,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem"
                  }}>
                  <span>{book.title}</span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{ background: "gray", color: "white", borderRadius: 4 }}
                      onClick={() => navigate(`/supervised/edit-book?slug=${encodeURIComponent(book.slug)}&lang=${book.language}`)}
                    >Edit</button>
                    <button
                      style={{ background: "#e53e3e", color: "white", borderRadius: 4 }}
                      onClick={() => confirmDelete(book.slug)}
                    >Delete</button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Modal */}
      {modal.show && (
        <div style={{
          position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "#fff", color: "#1e293b", border: "1px solid #ccc", padding: "1rem 2rem",
          borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 9999,
          width: "90%", maxWidth: 600, textAlign: "center", fontSize: "1rem"
        }}>
          <strong style={{ fontSize: "1.2rem", marginBottom: "0.5rem", display: "block" }}>{modal.title}</strong>
          <span>{modal.message}</span>
          <br />
          {modal.onYes ? (
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => { modal.onYes(); setModal({ ...modal, show: false }); }}
                style={{
                  background: "#e53e3e", color: "white", border: "none", padding: "0.5rem 1.2rem",
                  fontWeight: "bold", borderRadius: 6, marginRight: "1rem", cursor: "pointer"
                }}>Yes</button>
              <button
                onClick={() => setModal({ show: false })}
                style={{
                  background: "#287346", color: "white", border: "none", padding: "0.5rem 1.2rem",
                  fontWeight: "bold", borderRadius: 6, cursor: "pointer"
                }}>No</button>
            </div>
          ) : (
            <button
              onClick={() => setModal({ show: false })}
              style={{
                background: "#287346", color: "white", border: "none", padding: "0.5rem 1.2rem",
                fontWeight: "bold", borderRadius: 6, cursor: "pointer", marginTop: "1rem"
              }}>Close</button>
          )}
        </div>
      )}
    </div>
  );
}
