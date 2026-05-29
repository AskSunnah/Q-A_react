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

  return (
    <AdminLayout>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }
      `}</style>

      <div className="max-w-[900px] mx-auto mt-8">
        <h1 className="text-center text-[#c3a421] text-2xl font-bold mb-0">
          Manage Books
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-4">
          Drag books using the handle to change their order on the frontend.
        </p>

        <div className="flex justify-center gap-4 mb-4 mt-4">
          {LANGS.map((l) => (
            <button
              key={l.value}
              className={`py-2 px-5 border-none rounded-[5px] font-bold cursor-pointer text-base disabled:opacity-60 disabled:cursor-not-allowed ${
                lang === l.value
                  ? "bg-[#c3a421] text-white"
                  : "bg-[#e2e8f0] text-[#1e293b]"
              }`}
              onClick={() => setLang(l.value)}
              disabled={savingOrder}
            >
              {l.label}
            </button>
          ))}
        </div>

        {savingOrder && (
          <div className="text-center text-blue-600 font-semibold mb-4">
            Saving new order...
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading books...</div>
        ) : (
          <ul className="list-none p-0 max-w-[840px] mx-auto">
            {books.length === 0 ? (
              <li>No books found in {lang === "en" ? "English" : "Arabic"}.</li>
            ) : (
              books.map((book, index) => (
                <li
                  key={book._id}
                  draggable={!savingOrder}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white my-3 p-4 border-l-[5px] border-[#c3a421] rounded-[6px] flex justify-between items-center gap-4 transition-all duration-150 ${
                    draggedIndex === index ? "opacity-50" : "opacity-100"
                  } ${
                    dragOverIndex === index
                      ? "scale-[1.01] shadow-[0_4px_12px_rgba(195,164,33,0.35)]"
                      : "shadow-[0_2px_5px_rgba(0,0,0,0.05)]"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className="cursor-grab active:cursor-grabbing text-slate-500 text-xl select-none px-2"
                      title="Drag to reorder"
                    >
                      ☰
                    </span>

                    <span className="bg-slate-100 text-slate-700 py-1 px-2 rounded-full text-xs font-bold min-w-7 text-center">
                      {index + 1}
                    </span>

                    <span
                      onClick={() =>
                        navigate(`/library/read/${book.language}/${book.slug}`)
                      }
                      className="cursor-pointer text-[#1e293b] font-medium hover:underline"
                    >
                      {book.title}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap justify-end">
                    <button
                      className="py-[0.4rem] px-[0.8rem] border-none rounded cursor-pointer text-[0.95rem] text-white bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() => handleAddDownloadLink(book._id)}
                      disabled={savingOrder}
                    >
                      Add Download Link
                    </button>

                    <button
                      className="py-[0.4rem] px-[0.8rem] border-none rounded cursor-pointer text-[0.95rem] text-white bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      className="py-[0.4rem] px-[0.8rem] border-none rounded cursor-pointer text-[0.95rem] text-white bg-[#e53e3e] disabled:opacity-60 disabled:cursor-not-allowed"
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
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-white text-[#1e293b] border border-[#ccc] py-4 px-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[9999] w-[90%] max-w-[600px] text-center text-base">
          <strong className="text-[1.2rem] mb-2 block">{modal.title}</strong>

          <span>{modal.message}</span>

          <br />

          {modal.onYes ? (
            <div className="mt-4">
              <button
                onClick={() => {
                  modal.onYes();
                  setModal({ ...modal, show: false });
                }}
                className="bg-[#e53e3e] text-white border-none py-2 px-5 font-bold rounded-[6px] mr-4 cursor-pointer"
              >
                Yes
              </button>

              <button
                onClick={() => setModal({ show: false })}
                className="bg-[#287346] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModal({ show: false })}
              className="bg-[#287346] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer mt-4"
            >
              Close
            </button>
          )}
        </div>
      )}
    </AdminLayout>
  );
}