import React, { useEffect, useState } from "react";
import { fetchBooks } from "../../api/books.js";
import Navbar from '../../Components/Navbar';


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
const DOWNLOAD_LABEL = {
  en: "Download (Free)",
  ar: "تحميل (مجاني)",
};
export default function BookLibrary({ lang = "en" }) {
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
  fetchBooks(lang)
    .then((data) => {
      setBooks(
        data.map((b) => ({
          ...b,
          category: b.category ? b.category.toLowerCase() : "uncategorized",
        }))
      );
    })
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
  `/library/read/${lang}/${slug}`

const handleDownload = async (bookId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/books/${bookId}/download`);
    const data = await res.json();

    if (!res.ok || !data.downloadUrl) {
      alert("No download link available for this book.");
      return;
    }

    window.open(data.downloadUrl, "_blank"); // Opens the Drive download link
  } catch (err) {
    console.error("Error downloading:", err);
    alert("Something went wrong while downloading.");
  }
};


  return (
    <div
      className="library-bg"
      dir={dir}
    > <style>{`

    body{
      margin: 0;}
      .library-bg {
        margin: 0;
        font-family: var(--font-family);
        background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url("/books.jpeg");
        background-size:fit;
        background-position: center;
        min-height: 100vh;
      }
      header {
        background-color:var(--bg-lib-header);
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
      main button:hover {
        background: var(--button-bg-transparent);
        border: 1px solid var(--button-gradient);
        color: var(--text-main);
      }
        .lib-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .container {
    max-width: 1000px;
      margin: 2rem auto;
      padding: 1rem;
      border-radius: 12px;
        background-color: var(--bg-light);
        color:var( --text-main);
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
      background-color: var(--bg-secondary);
      border-radius: 8px;
      border: 2px solid var(--bg-color-header);
      color: var(--text-main);
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
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
      color:var(--text-main);
      margin-bottom: 1rem;
    }

    .book-card a {
      align-self: start;
      background: var(--button-gradient);
      color: var(--text-main);
      font-weight:10px;
      padding: 0.5rem 1rem;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s;
    }

    .book-card a:hover {
      background: var(--button-bg-transparent);
      border: 1px solid var(--button-gradient);
      color: var(--text-main);
    }

    footer {
      text-align: center;
      padding: 2rem 1rem;
      font-size: 0.9rem;
      color: #e2e8f0;
    }
    `}</style>
      <header>
        <h1>{lang === "ar" ? "الكتب العربية" : "English Books"}</h1>
      </header>
      {lang === "ar" ? (
        <Navbar
          dir="rtl"
          navItems={[
            { label: "الرئيسية", href: "/ar", internal: true },
            { label: "المكتبة", href: "/library_ar", internal: true },
                    { label: "عن الموقع", href: "/about-us/ar", internal: true },
                    { label: "شاركنا رأيك", href: "/feedback-ar", internal: true },
                    { label: "ساهم", href: "/contribute", internal: true }
                ]}
                languageSwitcher={{ label: "English", href: "/library/engbooks" }}
            />
      ) : (
        <Navbar
                dir="ltr"
                navItems={[
                    { label: "Home", href: "/", internal: true },
                    { label: "Library", href: "/library", internal: true },
                    { label: "About Us", href: "/about-us", internal: true },
                    { label: "Feedback", href: "/feedback", internal: true },
                    { label: "Contribute", href: "/contribute", internal: true }
                ]}
                languageSwitcher={{ label: "العربية", href: "/library/arabicbooks" }}
            />
      )}
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
            </p>
          ) : (
            displayBooks.map((book) => (
              <div className="book-card" key={book.slug} data-category={book.category}>
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-start" }}>
  {/* Read Book */}
  <a
    href={getBookLink(book.slug)}
    style={{
      background: "#c9a227",
      color: "black",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      textDecoration: "none",
      fontWeight: "700",
    }}
  >
    {READ_LABEL[lang]}
  </a>

  {/* Download Button */}
  <button
  onClick={() => handleDownload(book._id)}
  style={{
    background: "#1f6f3e",
    color: "white",
    border: "none",
    padding: "0.6rem 0.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "400",
    fontSize: "1.05rem",
  }}
>
  {DOWNLOAD_LABEL[lang]}
</button>

</div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
