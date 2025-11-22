// src/components/ReadBook/ReadBook.jsx
import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { fetchBook } from "../../api/book.js";
import Sidebar from "../../Components/library/Sidebar";
import BookContent from "../../Components/library/BookContent";
import Controls from "../../Components/library/Controls";
import Footer from "../../Components/Footer.jsx"
const LANG_LABELS = {
  en: { toc: "Table of Contents", back: "Book Details" },
  ar: { toc: "فهرس المحتويات", back: "تفاصيل الكتاب" }
};

export default function ReadBook() {
  const { lang, slug } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(1.1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTashkeelRemoved, setIsTashkeelRemoved] = useState(false);


 useEffect(() => {
  fetchBook(lang, slug)
    .then(bookData => {
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
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      if (currentPage < book?.pages?.length - 1) {
        setCurrentPage((prev) => prev + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [currentPage, book?.pages?.length]);
  if (!book) return <div></div>;

   const page = book.pages?.[currentPage] || { blocks: [] };
  const dir = lang === "ar" ? "rtl" : "ltr";
  const labels = LANG_LABELS[lang] || LANG_LABELS.en;
  const isArabic = lang === "ar";

  function handleTashkeelToggle() {
    setIsTashkeelRemoved(prev => !prev);
    console.log("Tashkeel toggled. Now removed:", !isTashkeelRemoved);
  }

  return (
    <div className="root" dir={dir}>
      <style>{`
    body {
      margin: 0;
    }

    header {
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/books.jpeg");
      background-size:fit;
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
      background-color: var(--bg-main);
      padding: 1rem;
      overflow-y: scroll;
      height: 70vh;
      margin-right:3px;
      
    }

    .sidebar h2 {
      font-size: 1.2rem;
      color: var(--text-main);
      margin-bottom: 1rem;
    }

    .sidebar a {
      display: block;
      text-decoration: none;
      color: var(--text-accent);
      padding: 0.4rem 0;
      font-size: 0.95rem;
      overflow: auto;
    }

    .sidebar a:hover {
      color: var(--text-main);
    }
    .sidebar-toggle {
      display: none;
      font-size: 1.3rem;
      background: none;
      border: none;
      cursor: pointer;
      text-align: right;
      margin: 6px;
      color: var(--primary);
    }
    .content {
      min-height: 50vh;
      width: 60vw;
      flex: 1;
      padding: 1em;
      line-height: 2;
      color:var(--text-main);
      font-size: 1.1rem;
      border: 1px double var(--border-color);
      background-color: var(--bg-secondary);
      border-radius: 2%;
      background:  url("/test1.jpg");
      background-size:cover;
      background-position: center;
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
      color: var(--button-text-color);
      background: var(--button-gradient);
      cursor: pointer;
      font-family: inherit;
    }
    .controls button:hover {
      background: white;
      border:1px solid var(--text-main);
      color:var(--text-main);
      border: 1px solid var(--primary);
      font-weight: 600;
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
      background: var(--bg-main);
      padding: 1rem 1.5rem;
      position: relative;
      z-index: 10;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
      color: var(--text-main);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.2s;
      display: inline-block;
    }

    .nav-link:hover,
    .nav-link:focus {
      background: var( --button-gradient);
      color:var(--text-main);
    }

    /* Hamburger Button */
    .nav-toggle {
      display: none;
      font-size: 1.3rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary);
      position: absolute;
      top: 9px;
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
          .tashkeel-btn {
      background: #0c0c0cff;
      color: #fff;
      border: none;
      padding: 0.4rem 1.4rem;
      border-radius: 999px;
      cursor: pointer;
      font-size: 0.9rem;
      margin-bottom: 0.8rem;
      margin-inline-start: 0.5rem;
    }

    .tashkeel-btn:hover {
      background: #ef0000f6;
    }

    `}</style>
      <header>
        <h1>{book.title}</h1>
      </header>
      <nav className="navbar">
        <ul>
          <li><Link className="nav-link" 
          to={lang === "ar" ? "/ar" : "/"} >
             {lang === "ar" ? "الرئيسية" : "Home"}
             </Link>
          </li>
          <li>
            <Link className="nav-link"
              to={lang === "ar" ? "/library_ar" : "/library"}
            >
              {lang === "ar" ? "المكتبة" : "Library"}
            </Link>
          </li>
          <li>
            <li>
            <Link className="nav-link" to={`/books/${lang}/${slug}`}>
              {labels.back}
            </Link>
</li>
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
  {isArabic && (
    <button className="tashkeel-btn" onClick={handleTashkeelToggle}>
    {isTashkeelRemoved ? "استعادة التشكيل" : "إزالة التشكيل"}
    </button>
  )}

  <BookContent
  blocks={page.blocks}
  references={page.references}
  fontSize={fontSize}
  removeTashkeel={isTashkeelRemoved}
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
      <Footer/>
    </div>
  );
}
