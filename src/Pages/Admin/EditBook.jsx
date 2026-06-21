import React, { useState, useEffect } from "react";
import AdminHeader from "../../Components/Admin/Header";
import { useParams } from "react-router-dom";
import {
  fetchBookAdmin,
  saveBookAdmin,
  fetchAuthors,
} from "../../api/adminBook";
import BookEditor from "../../Components/Admin/BookEditor";
import AdminLayout from "../../Components/Admin/AdminLayout";

export default function EditBook() {
  const { lang, slug } = useParams();
  const [book, setBook] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchBookAdmin(lang, slug)
      .then(setBook)
      .catch((err) => setMsg(err.message));
  }, [lang, slug]);
  const [authors, setAuthors] = useState([]);
  useEffect(() => {
    if (!book?.language) return;

    fetchAuthors(book.language)
      .then(setAuthors)
      .catch(() => setAuthors([]));
  }, [book?.language]);
  const handleFieldChange = (field, value) =>
    setBook({ ...book, [field]: value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveBookAdmin(lang, slug, book);
      setMsg("Book saved successfully!");
    } catch (err) {
      setMsg("Save failed: " + err.message);
    }
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
  if (!book) return <div>Loading...</div>;
  const fieldCls =
    "w-full mt-[0.3rem] p-[0.4rem] rounded border border-[#b8bbc6] block";
  const labelCls = "text-[0.95rem] font-bold";

  return (
    <AdminLayout>
      <style>{`body { margin: 0; font-family: 'Segoe UI', sans-serif; }`}</style>

      {/* outer div: background:#f4f6f8, minHeight:100vh */}
      <div className="bg-[#f4f6f8] min-h-screen">
        {/* inner wrapper: maxWidth:900, margin:2rem auto */}
        <div className="max-w-[900px] mx-auto mt-8">
          {/* h2: color:#c3a421 */}
          <h2 className="text-2xl font-bold mb-4 text-[#c3a421]">Edit Book</h2>

          <form onSubmit={handleSave}>
            {/* .form-row */}
            <div className="mb-4">
              <label className={labelCls}>
                Title
                <input
                  className={fieldCls}
                  value={book.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="mb-4">
              <label className={labelCls}>
                Slug
                <input
                  className={fieldCls}
                  value={book.slug}
                  onChange={(e) => handleFieldChange("slug", e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="mb-4">
              <label className={labelCls}>
                Saved Author
                <select
                  className={fieldCls}
                  value={book.authorId || ""}
                  onChange={handleAuthorSelect}
                >
                  <option value="">-- Select saved author --</option>
                  {authors.map((author) => (
                    <option key={author._id} value={author._id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className={labelCls}>
                Author
                <input
                  className={fieldCls}
                  value={book.author || ""}
                  onChange={(e) => handleFieldChange("author", e.target.value)}
                  disabled={!!book.authorId}
                />
              </label>
            </div>
            <div className="mb-4">
              <label className={labelCls}>
                About the Author
                <textarea
                  className={fieldCls}
                  value={book.authorBio || ""}
                  onChange={(e) =>
                    handleFieldChange("authorBio", e.target.value)
                  }
                  disabled={!!book.authorId}
                  placeholder="Write author biography/background"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className={labelCls}>
                Description
                <textarea
                  className={fieldCls}
                  value={book.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                />
              </label>
            </div>
            <div className="mb-4">
              <label className={labelCls}>
                About the Book
                <textarea
                  className={fieldCls}
                  value={book.aboutBook || ""}
                  onChange={(e) =>
                    handleFieldChange("aboutBook", e.target.value)
                  }
                  placeholder="Write detailed information about this book"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className={labelCls}>
                Category
                <input
                  className={fieldCls}
                  value={book.category}
                  onChange={(e) =>
                    handleFieldChange("category", e.target.value)
                  }
                  required
                />
              </label>
            </div>

            <div className="mb-4">
              <label className={labelCls}>
                Language
                <select
                  className={fieldCls}
                  value={book.language}
                  onChange={(e) =>
                    handleFieldChange("language", e.target.value)
                  }
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </label>
            </div>

            <BookEditor book={book} onChange={setBook} />

            {/* .btn-main: background:#1f6f3e, color:white */}
            <button
              type="submit"
              className="py-[0.4rem] px-4 border-none rounded mt-[0.3rem] mr-2 cursor-pointer bg-[#1f6f3e] text-white"
            >
              Save Book
            </button>

            <span className="ml-4 text-[#1f6f3e]">{msg}</span>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
