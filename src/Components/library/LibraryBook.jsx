import React, { useEffect, useState } from "react";
import { fetchBooks } from "../../api/book.js";
import "../../styles/library.css";
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
    >
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
