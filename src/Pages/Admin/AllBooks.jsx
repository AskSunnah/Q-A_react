// src/pages/AllBooks.jsx
import React, { useState, useEffect } from "react";
import {
  fetchBooksAdmin,
  deleteBookAdmin,
  reorderBooksAdmin,
} from "../../api/adminBook";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { API_BASE } from "../../../config";

const LANGS = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
];

export default function AllBooks() {
  const [lang, setLang] = useState("en");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onYes: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetchBooksAdmin(lang)
      .then(setBooks)
      .catch((err) =>
        setModal({
          show: true,
          title: "Error",
          message: err.message,
        })
      )
      .finally(() => setLoading(false));
  }, [lang]);

  // ==========================================================
  // DRAG AND DROP REORDER
  // ==========================================================

  const reorderLocally = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const previousBooks = books;
    const reorderedBooks = reorderLocally(books, draggedIndex, dropIndex);

    setBooks(reorderedBooks);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setSavingOrder(true);

    try {
      const orderedIds = reorderedBooks.map((book) => book._id);
      const updatedBooks = await reorderBooksAdmin(lang, orderedIds);

      setBooks(updatedBooks);

      setModal({
        show: true,
        title: "Order Updated",
        message: "Book order has been updated successfully.",
      });
    } catch (err) {
      setBooks(previousBooks);

      setModal({
        show: true,
        title: "Error",
        message: err.message || "Failed to update book order.",
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // ==========================================================
  // DELETE BOOK
  // ==========================================================

  const confirmDelete = (slug) => {
    setModal({
      show: true,
      title: "Delete Book",
      message: "Are you sure you want to delete this book?",
      onYes: () => doDelete(slug),
    });
  };

  const doDelete = async (slug) => {
    setModal({ show: false });
    setLoading(true);

    try {
      await deleteBookAdmin(lang, slug);
      setBooks(books.filter((b) => b.slug !== slug));
    } catch (err) {
      setModal({
        show: true,
        title: "Error",
        message: err.message,
      });
    }

    setLoading(false);
  };

  // ==========================================================
  // ADD DOWNLOAD LINK
  // ==========================================================

  const handleAddDownloadLink = async (bookId) => {
    const driveLink = prompt("Paste the Google Drive link here:");

    if (!driveLink) return;

    try {
      const res = await fetch(`${API_BASE}/api/books/admin/${bookId}/download`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driveLink }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add link");
      }

      alert("Download link updated successfully!");

      setBooks(
        books.map((b) =>
          b._id === bookId ? { ...b, download: data.download } : b
        )
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <AdminLayout>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }

        .drag-handle {
          cursor: grab;
          color: #64748b;
          font-size: 1.2rem;
          user-select: none;
          padding: 0 0.5rem;
        }

        .drag-handle:active {
          cursor: grabbing;
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: "2rem auto" }}>
        <h1 style={{ textAlign: "center", color: "#c3a421" }}>
          Manage Books
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginTop: "-0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          Drag books using the handle to change their frontend order.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {LANGS.map((l) => (
            <button
              key={l.value}
              style={{
                padding: "0.5rem 1.2rem",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                background: lang === l.value ? "#c3a421" : "#e2e8f0",
                color: lang === l.value ? "white" : "#1e293b",
              }}
              onClick={() => setLang(l.value)}
              disabled={savingOrder}
            >
              {l.label}
            </button>
          ))}
        </div>

        {savingOrder && (
          <div
            style={{
              textAlign: "center",
              color: "#2563eb",
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            Saving new order...
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center" }}>Loading books...</div>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              maxWidth: 840,
              margin: "0 auto",
            }}
          >
            {books.length === 0 ? (
              <li>
                No books found in {lang === "en" ? "English" : "Arabic"}.
              </li>
            ) : (
              books.map((book, index) => (
                <li
                  key={book._id}
                  draggable={!savingOrder}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    background: "#fff",
                    margin: "0.5rem 0",
                    padding: "1rem",
                    borderLeft: "5px solid #c3a421",
                    borderRadius: 6,
                    boxShadow:
                      dragOverIndex === index
                        ? "0 4px 12px rgba(195,164,33,0.35)"
                        : "0 2px 5px rgba(0,0,0,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    opacity: draggedIndex === index ? 0.5 : 1,
                    transform:
                      dragOverIndex === index ? "scale(1.01)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flex: 1,
                    }}
                  >
                    <span className="drag-handle" title="Drag to reorder">
                      ☰
                    </span>

                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#334155",
                        padding: "0.25rem 0.55rem",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        minWidth: 28,
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </span>

                    <span
                      onClick={() =>
                        navigate(`/library/read/${book.language}/${book.slug}`)
                      }
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "#1e293b",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.textDecoration = "none")
                      }
                    >
                      {book.title}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{
                        ...buttonStyle,
                        background: "#2563eb",
                      }}
                      onClick={() => handleAddDownloadLink(book._id)}
                      disabled={savingOrder}
                    >
                      Add Download Link
                    </button>

                    <button
                      style={{
                        ...buttonStyle,
                        background: "grey",
                      }}
                      onClick={() =>
                        navigate(
                          `/supervised/books/edit/${book.language}/${book.slug}`
                        )
                      }
                      disabled={savingOrder}
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        ...buttonStyle,
                        background: "#e53e3e",
                      }}
                      onClick={() => confirmDelete(book.slug)}
                      disabled={savingOrder}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {modal.show && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            color: "#1e293b",
            border: "1px solid #ccc",
            padding: "1rem 2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            width: "90%",
            maxWidth: 600,
            textAlign: "center",
            fontSize: "1rem",
          }}
        >
          <strong
            style={{
              fontSize: "1.2rem",
              marginBottom: "0.5rem",
              display: "block",
            }}
          >
            {modal.title}
          </strong>

          <span>{modal.message}</span>

          <br />

          {modal.onYes ? (
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => {
                  modal.onYes();
                  setModal({ ...modal, show: false });
                }}
                style={{
                  background: "#e53e3e",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1.2rem",
                  fontWeight: "bold",
                  borderRadius: 6,
                  marginRight: "1rem",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>

              <button
                onClick={() => setModal({ show: false })}
                style={{
                  background: "#287346",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1.2rem",
                  fontWeight: "bold",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModal({ show: false })}
              style={{
                background: "#287346",
                color: "white",
                border: "none",
                padding: "0.5rem 1.2rem",
                fontWeight: "bold",
                borderRadius: 6,
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Close
            </button>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

const buttonStyle = {
  padding: "0.4rem 0.8rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.95rem",
  color: "white",
};