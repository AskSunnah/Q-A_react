import React, { useEffect, useState } from "react";
import { fetchBooks } from "../../api/book.js";

import libraryBg from "../../assets/library-bg.webp"; // update path if needed

const CATEGORY_OPTIONS = {
  en: [
    { value: "all", label: "All Categories" },
    { value: "aqeedah", label: "Aqeedah" },
    { value: "seerah", label: "Seerah" },
    { value: "hadith", label: "Hadith" },
    { value: "fiqh", label: "Fiqh" },
  ],
  ar: [
    { value: "all", label: "كل التصنيفات" },
    { value: "aqeedah", label: "عقيدة" },
    { value: "seerah", label: "سيرة" },
    { value: "hadith", label: "حديث" },
    { value: "fiqh", label: "فقه" },
  ],
};

const READ_LABEL = {
  en: "Read Book",
  ar: "اقرأ الكتاب",
};

export default function BookLibrary({ lang = "en" }) {
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    fetchBooks(lang)
      .then(setBooks)
      .catch(() => setBooks([]));
  }, [lang]);

  useEffect(() => {
    let filtered = books.filter(
      (b) =>
        (category === "all" || b.category === category) &&
        (b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase()))
    );
    setDisplayBooks(filtered);
  }, [search, category, books]);

  // Proper link for each language
  const getBookLink = (slug) =>
    lang === "ar"
      ? `/library/library_ar/read.html?slug=${slug}`
      : `/library/library_eng/read.html?slug=${slug}`;

  return (
    <div
      className="library-bg"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${libraryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        direction: dir,
      }}
      dir={dir}
    > <style>{`
      :root {
        --primary-color: #1f6f3e;
        --secondary-color: #2e8b57;
        --background: #f7f7f7;
        --card-bg: #ffffff;
        --accent-bg: #f0f4fa;
        --text-color: #2c3e50;
        --font-family: "Segoe UI", sans-serif;
      }
      .library-bg {
        margin: 0;
        font-family: var(--font-family);
        background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/src/assets/library-bg.webp");
        background-size: cover;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;
        min-height: max-content;
      }
      main {
        max-width: 1000px;
        padding: 4rem;
        margin: 2rem auto;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #fff;
      }
      header {
        background-color: rgba(22, 101, 52, 0.9);
        color: white;
        padding: 2rem 1rem 1rem 1rem;
        text-align: center;
      }
      header h1 {
        font-size: 2rem;
      }
      .header p {
        margin-top: 0.5rem;
        font-size: 1.2rem;
        font-weight: 300;
      }
      .buttons {
        margin: 3rem;
      }
      main button {
        color: white;
        font-weight: 600;
        font-size: 1rem;
        background-color: #166534;
        border: none;
        border-radius: 6px;
        height: 50px;
        margin: 1rem;
        cursor: pointer;
      }
      main button:hover {
        background-color: #e2e8f0;
        color: #166534;
      }
      .container {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 12px;
      }
      .search-bar,
      .category-filter {
        text-align: center;
        margin-bottom: 1rem;
      }
      .search-bar input,
      .category-filter select {
        padding: 0.6rem 1rem;
        font-size: 1rem;
        border-radius: 6px;
        border: none;
        width: 80%;
        max-width: 400px;
      }
      .book-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      .book-card {
        background-color: var(--accent-bg);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .book-title {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }
      .book-author {
        font-size: 0.9rem;
        color: #cbd5e1;
        margin-bottom: 1rem;
      }
      .book-card a {
        align-self: start;
        background-color: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        text-decoration: none;
        border-radius: 4px;
        transition: background 0.3s;
      }
      .book-card a:hover {
        background-color: #14532d;
      }
      footer {
        text-align: center;
        padding: 2rem 1rem;
        font-size: 0.9rem;
        color: #e2e8f0;
      }
      @media (max-width: 768px) {
        main {
          padding: 2rem;
        }
        main button {
          margin: 1rem;
        }
      }
    `}</style>
      <header>
        <h1>{lang === "ar" ? "الكتب العربية" : "English Books"}</h1>
      </header>

      <div className="container">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder={lang === "ar" ? "ابحث في الكتب..." : "Search English books..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ direction: dir, textAlign: lang === "ar" ? "right" : "left" }}
          />
        </div>
        {/* Category Filter */}
        <div className="category-filter">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ direction: dir, textAlign: lang === "ar" ? "right" : "left" }}
          >
            {CATEGORY_OPTIONS[lang].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Book Grid */}
        <div className="book-grid">
          {displayBooks.length === 0 ? (
            <p>
              {lang === "ar" ? "لا توجد كتب مطابقة." : "No books found."}
            </p>
          ) : (
            displayBooks.map((book) => (
              <div className="book-card" key={book.slug} data-category={book.category}>
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
                <a href={getBookLink(book.slug)}>{READ_LABEL[lang]}</a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
