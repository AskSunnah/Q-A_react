// src/components/ReadBook/ReadBook.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchBook } from "../../api/book.js";
import Sidebar from "../../Components/library/Sidebar";
import BookContent from "../../Components/library/BookContent";
import Controls from "../../Components/library/Controls";
const LANG_LABELS = {
  en: { toc: "Table of Contents", back: "Back to Book" },
  ar: { toc: "فهرس المحتويات", back: "العودة إلى الكتاب" }
};

export default function ReadBook() {
  const { lang, slug } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(1.1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
  fetchBook(lang, slug)
    .then(bookData => {
      // Flatten chapters into a single pages array
      let flatPages = [];
      bookData.chapters.forEach((chapter, chapterIndex) => {
        chapter.pages.forEach((pg, pageIndex) => {
          flatPages.push({ ...pg, chapterIndex, pageIndex });
        });
      });
      bookData.pages = flatPages; 
      setBook(bookData);
      setCurrentPage(0);
    })
    .catch(() => setBook(null));
}, [lang, slug]);

  if (!book) return <div></div>;

  const page = book.pages?.[currentPage] || { blocks: [] };

  // Handle direction for Arabic
  const dir = lang === "ar" ? "rtl" : "ltr";
  const labels = LANG_LABELS[lang] || LANG_LABELS.en;

  return (
    <div className="root" dir={dir}>
      <style>{`
      :root {
      --primary-color: #1f6f3e;
      --secondary-color: #2e8b57;
      --background: #f7f7f7;
      --card-bg: #ffffff;
      --accent-bg: #f0f4fa;
      --text-color: #2c3e50;
      --font-family: 'Segoe UI', sans-serif;
    }
    body {
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      color: #111827;
      direction: ltr;
      margin: 0;
    }

    header {
      background-image:
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
       url("/library-bg.webp"); 
      background-size: cover;
      background-position: center;
      color: white;
      padding: 1rem 2rem;
      text-align: center;
    }

    .layout {
      display: flex;
      flex-direction: row;
      padding: 1em;
      
    }

    .sidebar {
      width: 20%;
      background-color: #fff;
      border-right: 1px solid #e5e7eb;
      padding: 1rem;
      overflow-y: scroll;
      height: 70vh;
      
    }

    .sidebar h2 {
      font-size: 1.2rem;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .sidebar a {
      display: block;
      text-decoration: none;
      color: var(--primary-color);
      padding: 0.4rem 0;
      font-size: 0.95rem;
      overflow: auto;
    }

    .sidebar a:hover {
      color: #166534;
    }
    .sidebar-toggle {
      display: none;
      font-size: 1.3rem;
      background: none;
      border: none;
      cursor: pointer;
      text-align: right;
      margin: 6px;
      color: var(--primary-color);
    }
    .content {
      min-height: 50vh;
      width: 60vw;
      flex: 1;
      padding: 1em;
      line-height: 2;
      font-size: 1.1rem;
      border: 1px double rgba(0, 95, 30, 0.203);
      background-color: #fff9f1;
      border-radius: 2%;
      text-align: justify;
    }

    .controls {
      text-align: center;
      margin-bottom: 1rem;
    }

     .controls input {
      margin: 0 0.3rem;
      padding: 0.4rem 0.7rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
      font-family: inherit;
    }
    .controls button{
      margin: 0 0.3rem;
      padding: 0.4rem 0.7rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      color: white;
      background-color: var(--primary-color);
      cursor: pointer;
      font-family: inherit;
    }
    .controls button:hover {
      background-color: #e5e5e5;
    }
    .referencebox{
      font-size: x-small;
      bottom: 0;
      padding: 1em;
    }
    .referencebox ul{
      list-style: none;
    }
    hr{
      color: rgba(0, 95, 30, 0.203);
      width: 90%;
    }
    .navbar {
      background-repeat: no-repeat;
      background: #e9f5ec;
      padding: 1rem 1.5rem;
      position: relative;
      z-index: 10;
    }

    .navbar ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.2s;
      display: inline-block;
    }

    .nav-link:hover,
    .nav-link:focus {
      background: var(--secondary-color);
      color: #fff;
    }

    /* Hamburger Button */
    .nav-toggle {
      display: none;
      font-size: 1.3rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary-color);
      position: absolute;
      top: 0.6rem;
      right: 1rem;
      z-index: 11;
    }

    /* Small Screens */
    @media (max-width: 768px) {

      .navbar {
        /* background:#e9f5ec; */
        padding: 1.5rem 0;
      }

      .nav-toggle {
        display: block;
      }

      .nav-menu {
        display: none;
        width: 100%;
      }

      .nav-menu.open {
        display: block;
      }

      .navbar ul {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      .layout{
        display: flex;
        flex-direction: column;
      }
      .sidebar {
        display: none;
        width: 100vw;
        overflow-y: auto;
        max-height: 50vh;
     }
     .sidebar-toggle{
      display: block;
     }
      .sidebar.open {
        
        display: block;
    }
    .content{
      width:fit-content;
    }
    }

    /* Dark mode styles */
    body.dark .navbar {
      background: #183c25;
    }

    body.dark .nav-link:hover,
    body.dark .nav-link:focus {
      background: #25603a;
    }
    .footer {
      text-align: center;
      font-size: 0.9rem;
      padding: 1rem;
      color: #6b7280;
    }
    `}</style>
      <header>
        <h1>{book.title}</h1>
      </header>
      <nav className="navbar">
        <ul>
          <li><Link to="/" >Home</Link></li>
          <li>
            <Link
              to={lang === "ar" ? "/library_ar" : "/library"}
            >
              {lang === "ar" ? "المكتبة" : "Library"}
            </Link>
          </li>
          <li>
            <button onClick={() => navigate(-1)}>
              {labels.back}
            </button>
          </li>
        </ul>
      </nav>
      <div className="layout">
        <button
  className="sidebar-toggle"
  onClick={() => setSidebarOpen(open => !open)}
  aria-label="Toggle sidebar"
>
  <img
    src="https://img.icons8.com/?size=100&id=42763&format=png&color=000000"
    alt="قائمة"
    width="30px"
  />
</button>
        <Sidebar
          open={sidebarOpen}
          chapters={book.chapters}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pages={book.pages}
          tocLabel={labels.toc}
        />
        <main>
          <BookContent
            blocks={page.blocks}
            references={page.references}
            fontSize={fontSize}
          />
          <Controls
            currentPage={currentPage}
            totalPages={book.pages ? book.pages.length : 0}
            setCurrentPage={setCurrentPage}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        </main>
      </div>
    </div>
  );
}
