import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBookAdmin,
  saveBookAdmin,
  fetchAuthors,
  updateAuthor,
} from "../../api/adminBook";
import BookEditor from "../../Components/Admin/BookEditor";
import AdminLayout from "../../Components/Admin/AdminLayout";

const CATEGORIES = [
  { value: "", label: "-- Select Category --" },
  { value: "Aqeedah", label: "Aqeedah Books" },
  { value: "Fiqh", label: "Fiqh" },
  { value: "Hadith", label: "Hadith" },
];

const LANGS = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
];

export default function EditBook() {
  const { lang, slug } = useParams();

  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [modal, setModal] = useState({ show: false, title: "", message: "" });
  const [editingAuthor, setEditingAuthor] = useState(null); // { _id, name, bio } | null

  useEffect(() => {
    fetchBookAdmin(lang, slug)
      .then(setBook)
      .catch((err) =>
        setModal({
          show: true,
          title: "Error",
          message: err.message,
        }),
      );
  }, [lang, slug]);

  useEffect(() => {
    if (!book?.language) return;

    fetchAuthors(book.language)
      .then(setAuthors)
      .catch(() => setAuthors([]));
  }, [book?.language]);

  if (!book) {
    return (
      <AdminLayout>
        <div className="w-full max-w-[850px] mx-auto mt-8 font-[Segoe_UI,sans-serif]">
          <div className="bg-white p-8 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
            Loading...
          </div>
        </div>
      </AdminLayout>
    );
  }

  const isArabic = book.language === "ar";

  const contentDirectionProps = isArabic
    ? {
        dir: "rtl",
        lang: "ar",
        style: { unicodeBidi: "plaintext" },
      }
    : {
        dir: "ltr",
        lang: "en",
        style: { unicodeBidi: "plaintext" },
      };

  const fieldCls =
    "block w-full mb-4 px-3 py-[0.6rem] text-base border border-[#ccc] rounded-lg box-border";

  const labelCls = "font-bold mt-4 block text-[var(--bg-color-header)]";

  const contentFieldCls = `${fieldCls} ${
    isArabic ? "text-right leading-8" : "text-left"
  }`;

  const slugFieldCls = `${fieldCls} text-left`;

  const selectFieldCls = `${fieldCls} ${isArabic ? "text-right" : "text-left"}`;

  const disabledFieldCls =
    "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

  const handleFieldChange = (field, value) => {
    if (field === "language") {
      setBook({
        ...book,
        language: value,
        authorId: "",
        author: "",
        authorBio: "",
      });
      return;
    }

    setBook({
      ...book,
      [field]: value,
    });
  };

  const handleAuthorSelect = (e) => {
    const selectedAuthorId = e.target.value;

    if (!selectedAuthorId) {
      setBook({
        ...book,
        authorId: "",
        author: "",
        authorBio: "",
      });
      return;
    }

    const selectedAuthor = authors.find((a) => a._id === selectedAuthorId);

    if (!selectedAuthor) return;

    setBook({
      ...book,
      authorId: selectedAuthor._id,
      author: selectedAuthor.name,
      authorBio: selectedAuthor.bio || "",
    });
  };

  // --- Author Edit Handlers ---
  const openEditAuthor = () => {
    const a = authors.find((x) => x._id === book.authorId);
    if (a) setEditingAuthor({ ...a });
  };

  const closeEditAuthor = () => {
    setEditingAuthor(null);
  };

  const handleSaveAuthor = async () => {
    if (!editingAuthor?.name?.trim()) {
      setModal({
        show: true,
        title: "Error",
        message: "Author name is required.",
      });
      return;
    }

    try {
      const updated = await updateAuthor(editingAuthor._id, {
        name: editingAuthor.name,
        bio: editingAuthor.bio,
      });

      setAuthors((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a)),
      );

      // Sync the currently-open book too, since it holds a local
      // copy of author/authorBio (denormalized onto the book on save).
      setBook((b) =>
        b.authorId === updated._id
          ? { ...b, author: updated.name, authorBio: updated.bio }
          : b,
      );

      setEditingAuthor(null);
    } catch (err) {
      setModal({
        show: true,
        title: "Error",
        message: err.message,
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await saveBookAdmin(lang, slug, book);

      setModal({
        show: true,
        title: "Success",
        message: "Book saved successfully!",
      });
    } catch (err) {
      setModal({
        show: true,
        title: "Error",
        message: "Save failed: " + err.message,
      });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-[850px] flex flex-col items-center mx-auto font-[Segoe_UI,sans-serif]">
        <h1 className="text-[2rem] mb-6 text-center text-[var(--bg-color-header)]">
          Edit Book
        </h1>

        <form
          onSubmit={handleSave}
          className="bg-white p-8 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-full"
        >
          <label className={labelCls}>Title:</label>
          <input
            {...contentDirectionProps}
            className={contentFieldCls}
            value={book.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            required
          />

          <label className={labelCls}>Slug:</label>
          <input
            dir="ltr"
            lang="en"
            className={slugFieldCls}
            value={book.slug || ""}
            onChange={(e) => handleFieldChange("slug", e.target.value)}
            required
          />

          <label className={labelCls}>Language:</label>
          <select
            className={fieldCls}
            value={book.language || "en"}
            onChange={(e) => handleFieldChange("language", e.target.value)}
            required
            dir="ltr"
            lang="en"
          >
            {LANGS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

          <label className={labelCls}>Saved Author:</label>
          <div className="flex items-center gap-2">
            <select
              {...contentDirectionProps}
              className={`${selectFieldCls} flex-1`}
              value={book.authorId || ""}
              onChange={handleAuthorSelect}
            >
              <option value="">
                -- Select saved author or type new below --
              </option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </select>

            {book.authorId && (
              <button
                type="button"
                title="Edit author details"
                onClick={openEditAuthor}
                className="p-2 rounded-lg border border-[#ccc] hover:bg-gray-50 shrink-0"
              >
                ✏️
              </button>
            )}
          </div>

          <label className={labelCls}>Author:</label>
          <input
            {...contentDirectionProps}
            className={`${contentFieldCls} ${disabledFieldCls}`}
            value={book.author || ""}
            onChange={(e) => handleFieldChange("author", e.target.value)}
            disabled={!!book.authorId}
          />

          <label className={labelCls}>About the Author:</label>
          <textarea
            {...contentDirectionProps}
            className={`${contentFieldCls} ${disabledFieldCls}`}
            value={book.authorBio || ""}
            onChange={(e) => handleFieldChange("authorBio", e.target.value)}
            disabled={!!book.authorId}
            placeholder="Write author biography/background"
          />

          <label className={labelCls}>Description:</label>
          <textarea
            {...contentDirectionProps}
            className={contentFieldCls}
            value={book.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
          />

          <label className={labelCls}>About the Book:</label>
          <textarea
            {...contentDirectionProps}
            className={contentFieldCls}
            value={book.aboutBook || ""}
            onChange={(e) => handleFieldChange("aboutBook", e.target.value)}
            placeholder="Write detailed information about this book"
          />

          <label className={labelCls}>Category:</label>
          <select
            className={fieldCls}
            value={book.category || ""}
            onChange={(e) => handleFieldChange("category", e.target.value)}
            required
            dir="ltr"
            lang="en"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <BookEditor
            book={book}
            onChange={setBook}
            isArabic={isArabic}
            contentDirectionProps={contentDirectionProps}
          />

          <button
            type="submit"
            className="bg-[var(--bg-color-header)] text-white border-none py-[0.7rem] px-[1.4rem] rounded-lg text-base font-bold cursor-pointer mt-6 w-full block transition-colors duration-300 hover:bg-[#1f5c38]"
          >
            Save Book
          </button>
        </form>
      </div>

      {/* Edit Author Modal */}
      {editingAuthor && (
        <div className="block fixed top-5 left-1/2 -translate-x-1/2 bg-white text-[#1e293b] border border-[#ccc] py-6 px-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[10000] w-[90%] max-w-[500px]">
          <strong className="block text-[1.1rem] mb-3">Edit Author</strong>

          <label className={labelCls}>Name:</label>
          <input
            className={fieldCls}
            value={editingAuthor.name}
            onChange={(e) =>
              setEditingAuthor({ ...editingAuthor, name: e.target.value })
            }
          />

          <label className={labelCls}>Bio:</label>
          <textarea
            className={fieldCls}
            value={editingAuthor.bio || ""}
            onChange={(e) =>
              setEditingAuthor({ ...editingAuthor, bio: e.target.value })
            }
          />

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="bg-[#287346] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer"
              onClick={handleSaveAuthor}
            >
              Save
            </button>
            <button
              type="button"
              className="bg-[#e53e3e] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer"
              onClick={closeEditAuthor}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {modal.show && (
        <div className="block fixed top-5 left-1/2 -translate-x-1/2 bg-white text-[#1e293b] border border-[#ccc] py-4 px-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[9999] w-[90%] max-w-[600px] text-center text-base">
          <strong className="block text-[1.2rem] mb-2">{modal.title}</strong>
          <span>{modal.message}</span>
          <br />
          <br />
          <button
            type="button"
            onClick={closeModal}
            className="bg-[#287346] text-white border-none py-2 px-4 font-bold rounded-[6px] cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
