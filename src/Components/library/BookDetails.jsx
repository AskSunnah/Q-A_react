import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBook } from "../../api/book"; // Make sure path is correct

// ...LANG_MAP remains the same...


// Labels and directions for both languages
const LANG_MAP = {
  en: {
    dir: "ltr",
    home: "Home",
    library: "Library",
    index: "Index of Topics",
    book: "Book",
    author: "Author",
    category: "Category",
    language: "Language",
    totalPages: "Total Pages",
    loading: "Loading...",
    error: "Error loading book",
    chapters: (slug, firstPage) => `/read/${slug}?page=${firstPage}`,
    libraryUrl: "/library",
  },
  ar: {
    dir: "rtl",
    home: "الرئيسية",
    library: "المكتبة",
    index: "فهرس المواضيع",
    book: "الكتاب",
    author: "المؤلف",
    category: "التصنيف",
    language: "اللغة",
    totalPages: "عدد الصفحات",
    loading: "جاري التحميل...",
    error: "تعذر تحميل الكتاب",
    chapters: (slug, firstPage) => `/read_ar/${slug}?page=${firstPage}`,
    libraryUrl: "/library/library_ar/library.html",
  },
};

export default function BookDetails() {
  const { lang = "en", slug } = useParams();
  const labels = LANG_MAP[lang] || LANG_MAP.en;
  const [book, setBook] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return setError(true);
    fetchBook(lang, slug)
      .then(setBook)
      .catch(() => setError(true));
  }, [lang, slug]);


  // Calculate total pages
  const totalPages = book?.chapters?.reduce((sum, ch) => sum + (ch.pages?.length || 0), 0) || 0;

  return (
    <div dir={labels.dir} style={{ background: "#f9f9f9", minHeight: "100vh", color: "#1e293b" }}>
      <style>{`
        :root {
          --primary: #1f6f3e;
          --secondary: #2e8b57;
        }
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #f9f9f9;
          margin: 0;
        }
        header {
          background-image:
            linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
            url('/library-bg.webp');
          background-size: cover;
          background-position: center;
          color: white;
          padding: 2rem;
          text-align: center;
        }
        .book-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        nav.navbar {
          background-color: #e9f5ec;
          padding: 1rem 1.5rem;
        }
        nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }
        nav .nav-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background 0.2s;
        }
        nav .nav-link:hover {
          background-color: var(--secondary);
          color: #fff;
        }
        .container {
          max-width: 960px;
          margin: 2rem auto;
          padding: 1rem;
        }
        .metadata {
          margin: 2rem 0;
          font-size: 1rem;
          line-height: 1.6;
          text-align: ${labels.dir === "rtl" ? "right" : "left"};
        }
        .toc h3 {
          margin-top: 2rem;
          text-align: ${labels.dir === "rtl" ? "right" : "left"};
        }
        .toc ul {
          list-style: none;
          padding-${labels.dir === "rtl" ? "right" : "left"}: 0;
        }
        .toc li {
          margin-bottom: 0.5rem;
        }
        .toc a {
          color: #1e40af;
          text-decoration: none;
        }
        .toc a:hover {
          text-decoration: underline;
        }
      `}</style>
      <header>
        <h1 className="book-title" id="bookTitle">
          {error ? labels.error : book?.title || labels.loading}
        </h1>
      </header>
      <nav className="navbar">
        <ul>
          <li><a className="nav-link" to="/">{labels.home}</a></li>
          <li><a className="nav-link" href={labels.libraryUrl}>{labels.library}</a></li>
        </ul>
      </nav>
      <div className="container">
        <div className="metadata" id="bookMeta">
          {book && !error && (
            <>
              <strong>{labels.book}:</strong> {book.title}<br />
              <strong>{labels.author}:</strong> {book.author}<br />
              <strong>{labels.category}:</strong> {book.category || "—"}<br />
              <strong>{labels.language}:</strong> {book.language}<br />
              <strong>{labels.totalPages}:</strong> {totalPages}<br />
            </>
          )}
        </div>
        <div className="toc">
          <h3>{labels.index}</h3>
          <ul id="chapterList">
            {book && book.chapters && book.chapters.map((chapter, index) => {
              // First page (by .number if present, else 1)
              const firstPage =
                chapter.pages && chapter.pages.length > 0
                  ? (chapter.pages[0].number || 1)
                  : 1;
              return (
                <li key={index}>
                  <a href={`/library/read/${lang}/${slug}?page=${firstPage}`}>
  {chapter.title}
</a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
