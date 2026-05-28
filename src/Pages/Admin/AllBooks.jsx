import React, { useState, useEffect } from "react";
import AdminHeader from "../../Components/Admin/Header";
import { fetchBooksAdmin, deleteBookAdmin } from "../../api/adminBook";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Components/Admin/AdminLayout";

const LANGS = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
];

export default function AllBooks() {
  const [lang, setLang] = useState("en");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
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
        setModal({ show: true, title: "Error", message: err.message }),
      )
      .finally(() => setLoading(false));
  }, [lang]);

  const confirmDelete = (slug) => {
    setModal({
      show: true,
      title: "Delete Book",
      message: "Are you sure you want to delete this book?",
      onYes: () => doDelete(slug),
    });
  };

  const handleAddDownloadLink = async (bookId) => {
    const driveLink = prompt("Paste the Google Drive link here:");
    try {
      const res = await fetch(
        `https://asksunnah-backend-hno9.onrender.com/api/admin/books/${bookId}/download`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driveLink }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to add link");
      alert("Download link updated successfully!");
      setBooks(
        books.map((b) =>
          b._id === bookId ? { ...b, download: data.download } : b,
        ),
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const doDelete = async (slug) => {
    setModal({ show: false });
    setLoading(true);
    try {
      await deleteBookAdmin(lang, slug);
      setBooks(books.filter((b) => b.slug !== slug));
    } catch (err) {
      setModal({ show: true, title: "Error", message: err.message });
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <style>{`body { margin: 0; font-family: 'Segoe UI', sans-serif; }`}</style>

      {/* outer wrapper: maxWidth:900, margin:"2rem auto" */}
      <div className="max-w-[900px] mx-auto mt-8">
        {/* h1: textAlign:center, color:#c3a421 */}
        <h1 className="text-center text-[#c3a421] text-2xl font-bold mb-0">
          Manage Books
        </h1>

        {/* lang toggle row */}
        <div className="flex justify-center gap-4 mb-8 mt-4">
          {LANGS.map((l) => (
            <button
              key={l.value}
              className={`py-2 px-5 border-none rounded-[5px] font-bold cursor-pointer text-base ${
                lang === l.value
                  ? "bg-[#c3a421] text-white"
                  : "bg-[#e2e8f0] text-[#1e293b]"
              }`}
              onClick={() => setLang(l.value)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center">Loading books...</div>
        ) : (
          <ul className="list-none p-0 max-w-[840px] mx-auto">
            {books.length === 0 ? (
              <li>No books found in {lang === "en" ? "English" : "Arabic"}.</li>
            ) : (
              books.map((book) => (
                <li
                  key={book.slug}
                  className="bg-white my-3 p-4 border-l-[5px] border-[#c3a421] rounded-[6px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] flex justify-between items-center gap-4"
                >
                  {/* clickable title */}
                  <span
                    onClick={() =>
                      navigate(`/library/read/${book.language}/${book.slug}`)
                    }
                    className="cursor-pointer text-[#1e293b] font-medium hover:underline"
                  >
                    {book.title}
                  </span>

                  {/* action buttons */}
                  <div className="flex gap-2">
                    {/* Add Download Link — blue */}
                    <button
                      className="py-[0.4rem] px-[0.8rem] border-none rounded cursor-pointer text-[0.95rem] text-white bg-[#2563eb]"
                      onClick={() => handleAddDownloadLink(book._id)}
                    >
                      Add Download Link
                    </button>

                    {/* Edit — grey */}
                    <button
                      className="py-[0.4rem] px-[0.8rem] border-none rounded cursor-pointer text-[0.95rem] text-white bg-gray-500"
                      onClick={() =>
                        navigate(
                          `/supervised/books/edit/${book.language}/${book.slug}`,
                        )
                      }
                    >
                      Edit
                    </button>

                    {/* Delete — red */}
                    <button
                      className="py-[0.4rem] px-[0.8rem] border-none rounded cursor-pointer text-[0.95rem] text-white bg-[#e53e3e]"
                      onClick={() => confirmDelete(book.slug)}
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

      {/* Modal */}
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
