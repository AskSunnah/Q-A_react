// src/pages/EditBook.jsx
import React, { useState, useEffect } from "react";
import AdminHeader from "../../Components/Admin/Header";
import { useParams } from "react-router-dom";
import { fetchBookAdmin, saveBookAdmin } from "../../api/adminBook";
import BookEditor from "../../Components/Admin/BookEditor";

export default function EditBook() {
  const { lang, slug } = useParams();
  const [book, setBook] = useState(null);
  const [msg, setMsg] = useState("");
  

  useEffect(() => {
    fetchBookAdmin(lang, slug)
      .then(setBook)
      .catch(err => setMsg(err.message));
  }, [lang, slug]);

  const handleFieldChange = (field, value) => setBook({ ...book, [field]: value });

  const handleSave = async e => {
    e.preventDefault();
    try {
      await saveBookAdmin(lang, slug, book);
      setMsg("Book saved successfully!");
    } catch (err) {
      setMsg("Save failed: " + err.message);
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div style={{ background: "#f4f6f8", minHeight: "100vh" }}>
      <AdminHeader />
      <style>{`
        body {
          font-family: 'Segoe UI', sans-serif;}
        .form-row { margin-bottom: 1rem; }
        input, textarea, select { width: 100%; margin-top: 0.3rem; padding: 0.4rem; border-radius: 4px; border: 1px solid #b8bbc6;}
        .chapter-block, .page-block, .block-block { border: 1px solid #28734633; border-radius: 6px; background: #fff; margin-bottom: 1rem; padding: 1rem; }
        .page-block, .block-block { margin-left: 1.5rem; }
        .block-block { margin-left: 2.5rem; background: #f8fafc;}
        button { padding: 0.4rem 1rem; border: none; border-radius: 4px; margin-top: 0.3rem; margin-right: 0.5rem; cursor: pointer;}
        .btn-add { background: #287346; color: white;}
        .btn-delete { background: #e53e3e; color: white;}
        .btn-main { background: #1f6f3e; color: white;}
        h2 { color: #287346; }
        label { font-size: 0.95rem; font-weight: bold; }
      `}</style>
      <div style={{ maxWidth: 900, margin: "2rem auto" }}>
        <h2>Edit Book</h2>
        <form onSubmit={handleSave}>
          <div className="form-row">
            <label>Title <input value={book.title} onChange={e => handleFieldChange("title", e.target.value)} required /></label>
          </div>
          <div className="form-row">
            <label>Slug <input value={book.slug} onChange={e => handleFieldChange("slug", e.target.value)} required /></label>
          </div>
          <div className="form-row">
            <label>Author <input value={book.author} onChange={e => handleFieldChange("author", e.target.value)} /></label>
          </div>
          <div className="form-row">
            <label>Description <textarea value={book.description} onChange={e => handleFieldChange("description", e.target.value)} /></label>
          </div>
          <div className="form-row">
            <label>Category <input value={book.category} onChange={e => handleFieldChange("category", e.target.value)} required /></label>
          </div>
          <div className="form-row">
            <label>Language
              <select value={book.language} onChange={e => handleFieldChange("language", e.target.value)}>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </label>
          </div>
          <BookEditor book={book} onChange={setBook} />
          <button type="submit" className="btn-main">Save Book</button>
          <span style={{ marginLeft: "1rem", color: "#1f6f3e" }}>{msg}</span>
        </form>
      </div>
    </div>
  );
}
