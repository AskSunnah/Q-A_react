// src/components/ReadBook/ReadBook.jsx

import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { fetchBook } from "../../api/book.js";
import Sidebar from "../../Components/library/Sidebar";
import BookContent from "../../Components/library/BookContent";
import Controls from "../../Components/library/Controls";
import Footer from "../../Components/Footer.jsx";
import { FiShare2 } from "react-icons/fi";

const LANG_LABELS = {
  en: { toc: "Table of Contents", back: "Book Details" },
  ar: { toc: "فهرس المحتويات", back: "تفاصيل الكتاب" },
};

export default function ReadBook() {
  const { lang, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(1.1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTashkeelRemoved, setIsTashkeelRemoved] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dir = lang === "ar" ? "rtl" : "ltr";
  const labels = LANG_LABELS[lang] || LANG_LABELS.en;
  const isArabic = lang === "ar";

  const goToPage = useCallback(
    (valueOrUpdater) => {
      setCurrentPage((prev) => {
        const totalPages = book?.pages?.length || 0;

        if (totalPages === 0) return prev;

        const nextPage =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(prev)
            : valueOrUpdater;

        const safePage = Math.min(Math.max(nextPage, 0), totalPages - 1);

        setSearchParams({ page: String(safePage + 1) });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return safePage;
      });
    },
    [book?.pages?.length, setSearchParams]
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    setBook(null);

    fetchBook(lang, slug)
      .then((bookData) => {
        let flatPages = [];

        bookData.chapters.forEach((chapter, chapterIndex) => {
          chapter.pages.forEach((pg, pageIndex) => {
            flatPages.push({ ...pg, chapterIndex, pageIndex });
          });
        });

        bookData.pages = flatPages;
        setBook(bookData);

        const params = new URLSearchParams(window.location.search);
        const pageFromUrl = Number(params.get("page")) || 1;

        const safePage =
          flatPages.length > 0
            ? Math.min(Math.max(pageFromUrl - 1, 0), flatPages.length - 1)
            : 0;

        setCurrentPage(safePage);
      })
      .catch(() => {
        setBook(null);
        setError(lang === "ar" ? "تعذر تحميل الكتاب." : "Could not load book.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lang, slug]);

  useEffect(() => {
    if (!book?.pages?.length) return;

    const pageFromUrl = Number(searchParams.get("page")) || 1;

    const safePage = Math.min(
      Math.max(pageFromUrl - 1, 0),
      book.pages.length - 1
    );

    if (safePage !== currentPage) {
      setCurrentPage(safePage);
    }
  }, [searchParams, book?.pages?.length, currentPage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!book?.pages?.length) return;

      if (e.key === "ArrowRight") {
        if (currentPage < book.pages.length - 1) {
          goToPage((prev) => prev + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentPage > 0) {
          goToPage((prev) => prev - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, book?.pages?.length, goToPage]);

  function handleTashkeelToggle() {
    setIsTashkeelRemoved((prev) => !prev);
  }

  const handleShare = async () => {
    const title = document.title;
    const url = window.location.href;

    const text = isArabic
      ? `📖 اقرأ هذا الكتاب على موقع السنّة: ${title}`
      : `📖 Read this book on AskSunnah: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Sharing cancelled or failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert(isArabic ? "📋 تم نسخ رابط الكتاب!" : "📋 Book link copied!");
    }
  };

  if (loading) {
    return (
      <div dir={dir}>
        {/* header skeleton */}
        <header
          className="text-white py-10 px-8 text-center"
          style={{
            background:
              'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/books.jpeg")',
            backgroundSize: "auto",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto h-8 w-[60%] max-w-[500px] rounded bg-white/30 animate-pulse" />
        </header>

        {/* navbar skeleton */}
        <nav className="bg-[var(--bg-main)] px-6 py-4 relative z-10 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
          <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-6">
            <li>
              <Link className="nav-link" to={lang === "ar" ? "/ar" : "/"}>
                {lang === "ar" ? "الرئيسية" : "Home"}
              </Link>
            </li>

            <li>
              <Link
                className="nav-link"
                to={lang === "ar" ? "/library_ar" : "/library"}
              >
                {lang === "ar" ? "المكتبة" : "Library"}
              </Link>
            </li>

            <li>
              <span className="nav-link opacity-60">{labels.back}</span>
            </li>
          </ul>
        </nav>

        {/* layout skeleton */}
        <div className="flex flex-row max-md:flex-col p-4">
          {/* sidebar skeleton */}
          <div
            className="w-[20%] shrink-0 min-w-[180px] bg-[var(--bg-main)] p-4 overflow-hidden h-[70vh] mr-[3px]
            max-md:w-screen max-md:max-h-[220px] max-md:mr-0"
          >
            <div className="h-6 w-[70%] bg-gray-300 rounded mb-5 animate-pulse" />

            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-300 rounded animate-pulse" />
              <div className="h-4 w-[85%] bg-gray-300 rounded animate-pulse" />
              <div className="h-4 w-[90%] bg-gray-300 rounded animate-pulse" />
              <div className="h-4 w-[75%] bg-gray-300 rounded animate-pulse" />
              <div className="h-4 w-[95%] bg-gray-300 rounded animate-pulse" />
              <div className="h-4 w-[80%] bg-gray-300 rounded animate-pulse" />
            </div>
          </div>

          {/* main content skeleton */}
          <main className="flex-1 min-w-0">
            <div
              className="
                w-full sm:w-[95%] md:w-[90%] lg:w-[85%] min-h-[50vh]
                px-3 py-3
                sm:px-5 sm:py-4
                md:px-8 md:py-6
                border border-double border-[var(--border-color)]
                rounded-[2%]
                overflow-hidden
              "
              style={{
                background: 'url("/test1.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="animate-pulse space-y-5">
                <div className="h-7 w-[45%] bg-gray-300 rounded" />

                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-300 rounded" />
                  <div className="h-4 w-[95%] bg-gray-300 rounded" />
                  <div className="h-4 w-[90%] bg-gray-300 rounded" />
                  <div className="h-4 w-[97%] bg-gray-300 rounded" />
                  <div className="h-4 w-[80%] bg-gray-300 rounded" />
                </div>

                <div className="space-y-3 pt-4">
                  <div className="h-4 w-full bg-gray-300 rounded" />
                  <div className="h-4 w-[92%] bg-gray-300 rounded" />
                  <div className="h-4 w-[88%] bg-gray-300 rounded" />
                  <div className="h-4 w-[96%] bg-gray-300 rounded" />
                  <div className="h-4 w-[75%] bg-gray-300 rounded" />
                </div>
              </div>
            </div>

            {/* controls skeleton */}
            <div className="flex justify-center items-center gap-3 mt-5 animate-pulse">
              <div className="h-9 w-24 bg-gray-300 rounded" />
              <div className="h-5 w-20 bg-gray-300 rounded" />
              <div className="h-9 w-24 bg-gray-300 rounded" />
            </div>
          </main>
        </div>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir={dir}
        className="min-h-screen flex items-center justify-center text-white text-center px-4"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("/books.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const page = book.pages?.[currentPage] || { blocks: [], references: [] };

  return (
    <div dir={dir}>
      {/* header */}
      <header
        className="text-white py-10 px-8 text-center"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/books.jpeg")',
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-tight break-words text-center truncate text-wrap">
          {book.title}
        </h1>
      </header>

      {/* navbar */}
      <nav className="bg-[var(--bg-main)] px-6 py-4 relative z-10 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
        <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-6">
          <li>
            <Link className="nav-link" to={lang === "ar" ? "/ar" : "/"}>
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </li>

          <li>
            <Link
              className="nav-link"
              to={lang === "ar" ? "/library_ar" : "/library"}
            >
              {lang === "ar" ? "المكتبة" : "Library"}
            </Link>
          </li>

          <li>
            <Link className="nav-link" to={`/books/${lang}/${slug}`}>
              {labels.back}
            </Link>
          </li>
        </ul>
      </nav>

      {/* layout */}
      <div className="flex flex-row max-md:flex-col p-4">
        {/* sidebar toggle button */}
        <button
          className="hidden max-md:block text-[1.3rem] bg-transparent border-none cursor-pointer text-right m-[6px] text-[var(--primary)]"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle sidebar"
        >
          <img
            src="https://img.icons8.com/?size=100&id=42763&format=png&color=000000"
            alt="قائمة"
            width="30px"
          />
        </button>

        {/* sidebar */}
        <div
          className={`w-[20%] shrink-0 min-w-[180px] bg-[var(--bg-main)] p-4 overflow-y-scroll h-[70vh] mr-[3px]
            max-md:w-screen max-md:overflow-y-auto max-md:max-h-[50vh] max-md:mr-0
            ${sidebarOpen ? "max-md:block" : "max-md:hidden"}`}
        >
          <Sidebar
            open={sidebarOpen}
            chapters={book.chapters}
            setCurrentPage={goToPage}
            currentPage={currentPage}
            pages={book.pages}
            tocLabel={labels.toc}
          />
        </div>

        {/* main content */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isArabic && (
              <>
                <button
                  className="bg-[#0c0c0c] text-white border-none px-[1.4rem] py-[0.4rem] rounded-full cursor-pointer text-[0.9rem] mb-[0.8rem] -ml-[3px] hover:bg-[#ef0000f6]"
                  onClick={handleTashkeelToggle}
                >
                  {isTashkeelRemoved ? "استعادة التشكيل" : "إزالة التشكيل"}
                </button>

                {page.audioUrl && (
                  <button
                    onClick={() => {
                      if (window.currentAudio && !window.currentAudio.paused) {
                        window.currentAudio.pause();
                        window.currentAudio = null;

                        const icon = document.getElementById("audio-icon");

                        if (icon) {
                          icon.innerHTML = `
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M11.25 5.25 6.75 9H4.5v6h2.25l4.5 3.75V5.25z
                            M16.5 8.25a3.75 3.75 0 010 7.5
                            m2.25-10.5a7.5 7.5 0 010 13.5"/>
                          `;
                        }
                      } else {
                        if (window.currentAudio) window.currentAudio.pause();

                        const audio = new Audio(page.audioUrl);
                        window.currentAudio = audio;
                        audio.play();

                        const icon = document.getElementById("audio-icon");

                        if (icon) {
                          icon.innerHTML = `
                            <path stroke-linecap="round" stroke-linejoin="round"
                            d="M10 9h2v6h-2zM14 9h2v6h-2z"/>
                          `;
                        }

                        audio.addEventListener("ended", () => {
                          const icon = document.getElementById("audio-icon");

                          if (icon) {
                            icon.innerHTML = `
                              <path stroke-linecap="round" stroke-linejoin="round"
                              d="M11.25 5.25 6.75 9H4.5v6h2.25l4.5 3.75V5.25z
                              M16.5 8.25a3.75 3.75 0 010 7.5
                              m2.25-10.5a7.5 7.5 0 010 13.5"/>
                            `;
                          }
                        });
                      }
                    }}
                    title="تشغيل الصوت"
                    className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-[0.6rem] py-[0.3rem] flex items-center justify-center h-8 transition-all duration-200 relative -top-[5.7px] hover:text-[#0077cc] hover:border-[#0077cc] hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      width="18"
                      height="18"
                      style={{ transform: "scaleX(-1)" }}
                    >
                      <path
                        id="audio-icon"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 5.25 6.75 9H4.5v6h2.25l4.5 3.75V5.25z
                        M16.5 8.25a3.75 3.75 0 010 7.5
                        m2.25-10.5a7.5 7.5 0 010 13.5"
                      />
                    </svg>
                  </button>
                )}

                <button
                  onClick={handleShare}
                  title={isArabic ? "شارك" : "Share"}
                  className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-[0.6rem] py-[0.3rem] flex items-center justify-center h-8 transition-all duration-200 relative -top-[5.7px] hover:text-[#0077cc] hover:border-[#0077cc] hover:scale-105"
                >
                  <FiShare2 size={18} />
                </button>
              </>
            )}
          </div>

          <BookContent
            blocks={page.blocks || []}
            references={page.references || []}
            fontSize={fontSize}
            removeTashkeel={isTashkeelRemoved}
          />

          <Controls
            currentPage={currentPage}
            totalPages={book.pages ? book.pages.length : 0}
            setCurrentPage={goToPage}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}