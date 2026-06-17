// // src/components/ReadBook/ReadBook.jsx

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useParams, Link, useSearchParams } from "react-router-dom";
// import { fetchBook } from "../../api/book.js";
// import Sidebar from "../../Components/library/Sidebar";
// import BookContent from "../../Components/library/BookContent";
// import Controls from "../../Components/library/Controls";
// import Footer from "../../Components/Footer.jsx";
// import { FiShare2 } from "react-icons/fi";

// const LANG_LABELS = {
//   en: { toc: "Table of Contents", back: "Book Details" },
//   ar: { toc: "فهرس المحتويات", back: "تفاصيل الكتاب" },
// };
// const getReadingProgressKey = (lang, slug) => {
//   return `reading-progress:${lang}:${slug}`;
// };

// const getReadingHistoryKey = () => {
//   return "reading-history";
// };

// const saveReadingProgress = ({ lang, slug, pageIndex, book }) => {
//   if (!book) return;

//   const progress = {
//     lang,
//     slug,
//     title: book.title || "",
//     author: book.author || "",
//     pageIndex,
//     pageNumber: pageIndex + 1,
//     updatedAt: new Date().toISOString(),
//   };

//   localStorage.setItem(
//     getReadingProgressKey(lang, slug),
//     JSON.stringify(progress)
//   );

//   const oldHistory = JSON.parse(
//     localStorage.getItem(getReadingHistoryKey()) || "[]"
//   );

//   const filteredHistory = oldHistory.filter(
//     (item) => !(item.lang === lang && item.slug === slug)
//   );

//   const newHistory = [progress, ...filteredHistory].slice(0, 30);

//   localStorage.setItem(getReadingHistoryKey(), JSON.stringify(newHistory));
// };

// const getSavedPageIndex = (lang, slug) => {
//   const saved = localStorage.getItem(getReadingProgressKey(lang, slug));

//   if (!saved) return null;

//   try {
//     const parsed = JSON.parse(saved);

//     if (typeof parsed.pageIndex === "number") {
//       return parsed.pageIndex;
//     }

//     if (typeof parsed.pageNumber === "number") {
//       return parsed.pageNumber - 1;
//     }

//     return null;
//   } catch {
//     return null;
//   }
// };
// export default function ReadBook() {
//   const { lang, slug } = useParams();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [book, setBook] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [fontSize, setFontSize] = useState(1.1);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isTashkeelRemoved, setIsTashkeelRemoved] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const audioRef = useRef(null);
//   const touchStartX = useRef(null);
//   const touchStartY = useRef(null);

//   const dir = lang === "ar" ? "rtl" : "ltr";
//   const labels = LANG_LABELS[lang] || LANG_LABELS.en;
//   const isArabic = lang === "ar";

//   const goToPage = useCallback(
//   (valueOrUpdater) => {
//     setCurrentPage((prev) => {
//       const totalPages = book?.pages?.length || 0;
//       if (totalPages === 0) return prev;

//       const nextPage =
//         typeof valueOrUpdater === "function"
//           ? valueOrUpdater(prev)
//           : valueOrUpdater;

//       const safePage = Math.min(Math.max(nextPage, 0), totalPages - 1);

//       setSearchParams({ page: String(safePage + 1) });

//       saveReadingProgress({
//         lang,
//         slug,
//         pageIndex: safePage,
//         book,
//       });

//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current = null;
//         setIsPlaying(false);
//       }

//       return safePage;
//     });
//   },
//   [book, lang, slug, setSearchParams]
// );
//   // ── Load book ────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     setLoading(true);
//     setError("");
//     setBook(null);

//     fetchBook(lang, slug)
//       .then((bookData) => {
//         let flatPages = [];
//         bookData.chapters.forEach((chapter, chapterIndex) => {
//           chapter.pages.forEach((pg, pageIndex) => {
//             flatPages.push({ ...pg, chapterIndex, pageIndex });
//           });
//         });
//         bookData.pages = flatPages;
//         setBook(bookData);

//         const params = new URLSearchParams(window.location.search);
//         const hasPageInUrl = params.has("page");

//         let startingPageIndex = 0;

//         if (hasPageInUrl) {
//           const pageFromUrl = Number(params.get("page")) || 1;
//           startingPageIndex = pageFromUrl - 1;
//         } else {
//           const savedPageIndex = getSavedPageIndex(lang, slug);
//           startingPageIndex =
//             typeof savedPageIndex === "number" ? savedPageIndex : 0;
//         }

//         const safePage =
//           flatPages.length > 0
//             ? Math.min(Math.max(startingPageIndex, 0), flatPages.length - 1)
//             : 0;

//         setCurrentPage(safePage);
//         setSearchParams({ page: String(safePage + 1) });

//         saveReadingProgress({
//           lang,
//           slug,
//           pageIndex: safePage,
//           book: bookData,
//         });
//       })
//       .catch(() => {
//         setBook(null);
//         setError(lang === "ar" ? "تعذر تحميل الكتاب." : "Could not load book.");
//       })
//       .finally(() => setLoading(false));
//   }, [lang, slug]);

//  // ── Sync URL → page ──────────────────────────────────────────────────────────
// useEffect(() => {
//   if (!book?.pages?.length) return;
//   if (!searchParams.has("page")) return;

//   const pageFromUrl = Number(searchParams.get("page")) || 1;

//   const safePage = Math.min(
//     Math.max(pageFromUrl - 1, 0),
//     book.pages.length - 1
//   );

//   if (safePage !== currentPage) {
//     setCurrentPage(safePage);

//     saveReadingProgress({
//       lang,
//       slug,
//       pageIndex: safePage,
//       book,
//     });
//   }
// }, [searchParams, book, currentPage, lang, slug]);

//   // ── Keyboard navigation — RTL aware ─────────────────────────────────────────
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (document.activeElement?.tagName === "INPUT") return;
//       if (!book?.pages?.length) return;

//       const forwardKey  = isArabic ? "ArrowLeft"  : "ArrowRight";
//       const backwardKey = isArabic ? "ArrowRight" : "ArrowLeft";

//       if (e.key === forwardKey) {
//         if (currentPage < book.pages.length - 1) goToPage((p) => p + 1);
//       } else if (e.key === backwardKey) {
//         if (currentPage > 0) goToPage((p) => p - 1);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentPage, book?.pages?.length, goToPage, isArabic]);

//   // ── Swipe navigation — RTL aware ─────────────────────────────────────────────
//   useEffect(() => {
//     const handleTouchStart = (e) => {
//       touchStartX.current = e.touches[0].clientX;
//       touchStartY.current = e.touches[0].clientY;
//     };
//     const handleTouchEnd = (e) => {
//       if (touchStartX.current === null) return;
//       const dx = e.changedTouches[0].clientX - touchStartX.current;
//       const dy = e.changedTouches[0].clientY - touchStartY.current;
//       if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

//       const swipedForward  = isArabic ? dx > 0 : dx < 0;
//       const swipedBackward = isArabic ? dx < 0 : dx > 0;

//       if (swipedForward && currentPage < (book?.pages?.length || 0) - 1) {
//         goToPage((p) => p + 1);
//       } else if (swipedBackward && currentPage > 0) {
//         goToPage((p) => p - 1);
//       }
//       touchStartX.current = null;
//       touchStartY.current = null;
//     };
//     window.addEventListener("touchstart", handleTouchStart, { passive: true });
//     window.addEventListener("touchend", handleTouchEnd, { passive: true });
//     return () => {
//       window.removeEventListener("touchstart", handleTouchStart);
//       window.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentPage, book?.pages?.length, goToPage, isArabic]);

//   // ── Audio toggle ─────────────────────────────────────────────────────────────
//   function handleAudioToggle(audioUrl) {
//     if (isPlaying && audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current = null;
//       setIsPlaying(false);
//     } else {
//       if (audioRef.current) audioRef.current.pause();
//       const audio = new Audio(audioUrl);
//       audioRef.current = audio;
//       audio.play();
//       setIsPlaying(true);
//       audio.addEventListener("ended", () => setIsPlaying(false));
//     }
//   }

//   // ── Share ─────────────────────────────────────────────────────────────────────
//   const handleShare = async () => {
//     const title = document.title;
//     const url = window.location.href;
//     const text = isArabic
//       ? `📖 اقرأ هذا الكتاب على موقع السنّة: ${title}`
//       : `📖 Read this book on AskSunnah: ${title}`;
//     if (navigator.share) {
//       try { await navigator.share({ title, text, url }); }
//       catch (err) { console.log("Sharing cancelled or failed:", err); }
//     } else {
//       await navigator.clipboard.writeText(url);
//       alert(isArabic ? "📋 تم نسخ رابط الكتاب!" : "📋 Book link copied!");
//     }
//   };

//   // ── Loading skeleton ─────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div dir={dir} className="flex flex-col min-h-screen">
//         <header
//           className="text-white py-10 px-8 text-center shrink-0"
//           style={{
//             background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/books.jpeg")',
//             backgroundSize: "auto",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="mx-auto h-8 w-[60%] max-w-[500px] rounded bg-white/30 animate-pulse" />
//         </header>
//         <nav className="bg-[var(--bg-main)] px-6 py-4 z-10 shrink-0">
//           <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-6">
//             <li><Link className="nav-link" to={lang === "ar" ? "/ar" : "/"}>{lang === "ar" ? "الرئيسية" : "Home"}</Link></li>
//             <li><Link className="nav-link" to={lang === "ar" ? "/library_ar" : "/library"}>{lang === "ar" ? "المكتبة" : "Library"}</Link></li>
//             <li><span className="nav-link opacity-60">{labels.back}</span></li>
//           </ul>
//         </nav>
//         <div className="flex flex-row max-md:flex-col flex-1 p-4 gap-2">
//           <div className="w-[22%] shrink-0 min-w-[180px] bg-[var(--bg-main)] p-4 max-md:w-full">
//             <div className="h-6 w-[70%] bg-gray-300 rounded mb-5 animate-pulse" />
//             <div className="space-y-3">
//               {[100, 85, 90, 75, 95].map((w, i) => (
//                 <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" style={{ width: `${w}%` }} />
//               ))}
//             </div>
//           </div>
//           <main className="flex-1 min-w-0">
//             <div className="w-full h-64 rounded-[2%] border border-double border-[var(--border-color)] overflow-hidden animate-pulse"
//               style={{ background: 'url("/test1.jpg")', backgroundSize: "cover" }} />
//           </main>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // ── Error ─────────────────────────────────────────────────────────────────────
//   if (error) {
//     return (
//       <div dir={dir} className="min-h-screen flex items-center justify-center text-white text-center px-4"
//         style={{ background: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("/books.jpeg")', backgroundSize: "cover", backgroundPosition: "center" }}>
//         <p className="text-lg font-semibold">{error}</p>
//       </div>
//     );
//   }

//   if (!book) return null;

//   const page = book.pages?.[currentPage] || { blocks: [], references: [] };

//   /*
//     LAYOUT STRATEGY
//     ───────────────
//     The outer wrapper is h-screen (full viewport, no scroll).
//     Header + Navbar are shrink-0 at the top.
//     The body row (sidebar + main) takes all remaining height via flex-1 + overflow-hidden.
//     Sidebar: position sticky inside its own scrollable column — it locks to the viewport
//              and only its inner content scrolls. The page itself never scrolls.
//     Main: overflow-y-auto so book content scrolls internally.
//     Controls: fixed at the bottom, always visible.

//     This means:
//     - The sidebar never pushes the page down
//     - The sidebar TOC scrolls independently
//     - The book content scrolls independently
//     - Nothing on the page itself ever scrolls
//   */
//   return (
//     <div dir={dir} className="flex flex-col h-screen overflow-hidden">

//       {/* ── Header ── */}
//       <header
//         className="text-white py-6 px-8 text-center shrink-0"
//         style={{
//           background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/books.jpeg")',
//           backgroundSize: "auto",
//           backgroundPosition: "center",
//         }}
//       >
//         <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl leading-tight break-words text-center truncate text-wrap">
//           {book.title}
//         </h1>
//       </header>

//       {/* ── Navbar ── */}
//       <nav className="bg-[var(--bg-main)] px-6 py-3 z-10 shrink-0 border-b border-[var(--border-color)] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
//         <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-6">
//           <li><Link className="nav-link" to={lang === "ar" ? "/ar" : "/"}>{lang === "ar" ? "الرئيسية" : "Home"}</Link></li>
//           <li><Link className="nav-link" to={lang === "ar" ? "/library_ar" : "/library"}>{lang === "ar" ? "المكتبة" : "Library"}</Link></li>
//           <li><Link className="nav-link" to={`/books/${lang}/${slug}`}>{labels.back}</Link></li>
//         </ul>
//       </nav>

//       {/* ── Body row — fills all remaining height ── */}
//       <div className="flex flex-row flex-1 overflow-hidden">

//         {/* ── Sidebar column ── */}
//         {/*
//           Desktop: fixed-width column, overflow-y-auto — the sidebar content scrolls
//           independently. The column itself doesn't scroll the page.

//           Mobile: hidden by default, shown as an overlay drawer via sidebarOpen state.
//           It uses position:fixed on mobile so it slides over the content
//           without affecting the layout flow.
//         */}
//         <div
//           className={`
//             shrink-0 bg-[var(--bg-main)] border-e border-[var(--border-color)] overflow-y-auto
//             w-[22%] min-w-[180px]
//             max-md:fixed max-md:inset-y-0 max-md:start-0 max-md:w-[75vw] max-md:max-w-[300px]
//             max-md:z-50 max-md:shadow-xl max-md:transition-transform max-md:duration-300
//             ${sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
//             ${isArabic && !sidebarOpen ? "max-md:translate-x-full" : ""}
//             ${isArabic && sidebarOpen ? "max-md:translate-x-0" : ""}
//           `}
//         >
//           {/* Extra top padding on mobile to clear the navbar area */}
//           <div className="p-4 max-md:pt-16">
//             <Sidebar
//               open={sidebarOpen}
//               chapters={book.chapters}
//               setCurrentPage={(p) => { goToPage(p); setSidebarOpen(false); }}
//               currentPage={currentPage}
//               pages={book.pages}
//               tocLabel={labels.toc}
//               isRTL={isArabic}
//             />
//           </div>
//         </div>

//         {/* Mobile sidebar backdrop — tap to close */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 z-40 bg-black/40 max-md:block hidden"
//             onClick={() => setSidebarOpen(false)}
//             aria-hidden="true"
//           />
//         )}

//         {/* ── Main content column ── */}
//         {/*
//           overflow-y-auto: book content scrolls inside this column.
//           pb-16: clears the fixed Controls bar at the bottom.
//         */}
//         <main className="flex-1 min-w-0 overflow-y-auto pb-16">

//           {/* Mobile sidebar toggle button */}
//           <button
//             className="md:hidden flex items-center gap-2 text-[0.85rem] text-[var(--primary)] bg-transparent border-none cursor-pointer px-4 py-2 shrink-0"
//             onClick={() => setSidebarOpen((o) => !o)}
//             aria-label="Toggle table of contents"
//             aria-expanded={sidebarOpen}
//           >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="3" y1="6" x2="21" y2="6" />
//               <line x1="3" y1="12" x2="15" y2="12" />
//               <line x1="3" y1="18" x2="18" y2="18" />
//             </svg>
//             {sidebarOpen ? (isArabic ? "إخفاء الفهرس" : "Hide Contents") : (isArabic ? "عرض الفهرس" : "Contents")}
//           </button>

//           {/* Action bar */}
//           <div className="flex items-center gap-2 px-3 pt-2 pb-1 flex-wrap">
//             {isArabic && (
//               <>
//                 <button
//                   className="bg-[#0c0c0c] text-white border-none px-4 py-1.5 rounded-full cursor-pointer text-[0.85rem] hover:bg-[#ef0000f6] transition-colors"
//                   onClick={() => setIsTashkeelRemoved((p) => !p)}
//                 >
//                   {isTashkeelRemoved ? "استعادة التشكيل" : "إزالة التشكيل"}
//                 </button>

//                 {page.audioUrl && (
//                   <button
//                     onClick={() => handleAudioToggle(page.audioUrl)}
//                     title="تشغيل الصوت"
//                     aria-label={isPlaying ? "إيقاف الصوت" : "تشغيل الصوت"}
//                     className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-2.5 py-1.5 flex items-center justify-center h-8 transition-all duration-200 hover:text-[#0077cc] hover:border-[#0077cc] hover:scale-105"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" width="18" height="18" style={{ transform: "scaleX(-1)" }}>
//                       {isPlaying
//                         ? <path strokeLinecap="round" strokeLinejoin="round" d="M10 9h2v6h-2zM14 9h2v6h-2z" />
//                         : <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 5.25 6.75 9H4.5v6h2.25l4.5 3.75V5.25z M16.5 8.25a3.75 3.75 0 010 7.5 m2.25-10.5a7.5 7.5 0 010 13.5" />
//                       }
//                     </svg>
//                   </button>
//                 )}
//               </>
//             )}

//             <button
//               onClick={handleShare}
//               title={isArabic ? "شارك" : "Share"}
//               aria-label={isArabic ? "شارك" : "Share this page"}
//               className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-2.5 py-1.5 flex items-center justify-center h-8 transition-all duration-200 hover:text-[#0077cc] hover:border-[#0077cc] hover:scale-105"
//             >
//               <FiShare2 size={16} />
//             </button>
//           </div>

//           {/* Book content */}
//           {/* <div className="px-3 pb-2">
//             <BookContent
//               blocks={page.blocks || []}
//               references={page.references || []}
//               fontSize={fontSize}
//               removeTashkeel={isTashkeelRemoved}
//             />
//           </div> */}

//           {/* Book content */}
//           <div className="px-3 pb-2">
//             <BookContent
//               blocks={page.blocks || []}
//               references={page.references || []}
//               fontSize={fontSize}
//               removeTashkeel={isTashkeelRemoved}
//               lang={lang}
//               bookId={book._id}
//               chapterNumber={book.chapters[page.chapterIndex]?.number}
//               pageNumber={page.number}
//             />
//           </div>
//         </main>
//       </div>

//       {/* Fixed Controls bar */}
//       <Controls
//         currentPage={currentPage}
//         totalPages={book.pages ? book.pages.length : 0}
//         setCurrentPage={goToPage}
//         fontSize={fontSize}
//         setFontSize={setFontSize}
//         isRTL={isArabic}
//       />
//     </div>
//   );
// }

// src/components/ReadBook/ReadBook.jsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { fetchBook } from "../../api/book.js";
import Sidebar from "../../Components/library/Sidebar";
import BookContent from "../../Components/library/BookContent";
import Controls from "../../Components/library/Controls";
import Footer from "../../Components/Footer.jsx";
import { ReportModal } from "../../Components/common/ReportableContent";
import { FiShare2 } from "react-icons/fi";
import { Flag } from "lucide-react";

const LANG_LABELS = {
  en: { toc: "Table of Contents", back: "Book Details" },
  ar: { toc: "فهرس المحتويات", back: "تفاصيل الكتاب" },
};
const getReadingProgressKey = (lang, slug) => {
  return `reading-progress:${lang}:${slug}`;
};

const getReadingHistoryKey = () => {
  return "reading-history";
};

const saveReadingProgress = ({ lang, slug, pageIndex, book }) => {
  if (!book) return;

  const progress = {
    lang,
    slug,
    title: book.title || "",
    author: book.author || "",
    pageIndex,
    pageNumber: pageIndex + 1,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    getReadingProgressKey(lang, slug),
    JSON.stringify(progress)
  );

  const oldHistory = JSON.parse(
    localStorage.getItem(getReadingHistoryKey()) || "[]"
  );

  const filteredHistory = oldHistory.filter(
    (item) => !(item.lang === lang && item.slug === slug)
  );

  const newHistory = [progress, ...filteredHistory].slice(0, 30);

  localStorage.setItem(getReadingHistoryKey(), JSON.stringify(newHistory));
};

const getSavedPageIndex = (lang, slug) => {
  const saved = localStorage.getItem(getReadingProgressKey(lang, slug));

  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);

    if (typeof parsed.pageIndex === "number") {
      return parsed.pageIndex;
    }

    if (typeof parsed.pageNumber === "number") {
      return parsed.pageNumber - 1;
    }

    return null;
  } catch {
    return null;
  }
};

export default function ReadBook() {
  const { lang, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(1.1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTashkeelRemoved, setIsTashkeelRemoved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportOpen, setReportOpen] = useState(false);   // ← report modal state

  const audioRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

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

        saveReadingProgress({
          lang,
          slug,
          pageIndex: safePage,
          book,
        });

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
          setIsPlaying(false);
        }

        return safePage;
      });
    },
    [book, lang, slug, setSearchParams]
  );

  // ── Load book ────────────────────────────────────────────────────────────────
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
        const hasPageInUrl = params.has("page");

        let startingPageIndex = 0;

        if (hasPageInUrl) {
          const pageFromUrl = Number(params.get("page")) || 1;
          startingPageIndex = pageFromUrl - 1;
        } else {
          const savedPageIndex = getSavedPageIndex(lang, slug);
          startingPageIndex =
            typeof savedPageIndex === "number" ? savedPageIndex : 0;
        }

        const safePage =
          flatPages.length > 0
            ? Math.min(Math.max(startingPageIndex, 0), flatPages.length - 1)
            : 0;

        setCurrentPage(safePage);
        setSearchParams({ page: String(safePage + 1) });

        saveReadingProgress({
          lang,
          slug,
          pageIndex: safePage,
          book: bookData,
        });
      })
      .catch(() => {
        setBook(null);
        setError(lang === "ar" ? "تعذر تحميل الكتاب." : "Could not load book.");
      })
      .finally(() => setLoading(false));
  }, [lang, slug]);

  // ── Sync URL → page ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!book?.pages?.length) return;
    if (!searchParams.has("page")) return;

    const pageFromUrl = Number(searchParams.get("page")) || 1;

    const safePage = Math.min(
      Math.max(pageFromUrl - 1, 0),
      book.pages.length - 1
    );

    if (safePage !== currentPage) {
      setCurrentPage(safePage);

      saveReadingProgress({
        lang,
        slug,
        pageIndex: safePage,
        book,
      });
    }
  }, [searchParams, book, currentPage, lang, slug]);

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (!book?.pages?.length) return;

      const forwardKey  = isArabic ? "ArrowLeft"  : "ArrowRight";
      const backwardKey = isArabic ? "ArrowRight" : "ArrowLeft";

      if (e.key === forwardKey) {
        if (currentPage < book.pages.length - 1) goToPage((p) => p + 1);
      } else if (e.key === backwardKey) {
        if (currentPage > 0) goToPage((p) => p - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, book?.pages?.length, goToPage, isArabic]);

  // ── Swipe navigation ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

      const swipedForward  = isArabic ? dx > 0 : dx < 0;
      const swipedBackward = isArabic ? dx < 0 : dx > 0;

      if (swipedForward && currentPage < (book?.pages?.length || 0) - 1) {
        goToPage((p) => p + 1);
      } else if (swipedBackward && currentPage > 0) {
        goToPage((p) => p - 1);
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage, book?.pages?.length, goToPage, isArabic]);

  // ── Audio toggle ─────────────────────────────────────────────────────────────
  function handleAudioToggle(audioUrl) {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      setIsPlaying(true);
      audio.addEventListener("ended", () => setIsPlaying(false));
    }
  }

  // ── Share ─────────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const title = document.title;
    const url = window.location.href;
    const text = isArabic
      ? `📖 اقرأ هذا الكتاب على موقع السنّة: ${title}`
      : `📖 Read this book on AskSunnah: ${title}`;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); }
      catch (err) { console.log("Sharing cancelled or failed:", err); }
    } else {
      await navigator.clipboard.writeText(url);
      alert(isArabic ? "📋 تم نسخ رابط الكتاب!" : "📋 Book link copied!");
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div dir={dir} className="flex flex-col min-h-screen">
        <header
          className="text-white py-10 px-8 text-center shrink-0"
          style={{
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/books.jpeg")',
            backgroundSize: "auto",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto h-8 w-[60%] max-w-[500px] rounded bg-white/30 animate-pulse" />
        </header>
        <nav className="bg-[var(--bg-main)] px-6 py-4 z-10 shrink-0">
          <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-6">
            <li><Link className="nav-link" to={lang === "ar" ? "/ar" : "/"}>{lang === "ar" ? "الرئيسية" : "Home"}</Link></li>
            <li><Link className="nav-link" to={lang === "ar" ? "/library_ar" : "/library"}>{lang === "ar" ? "المكتبة" : "Library"}</Link></li>
            <li><span className="nav-link opacity-60">{labels.back}</span></li>
          </ul>
        </nav>
        <div className="flex flex-row max-md:flex-col flex-1 p-4 gap-2">
          <div className="w-[22%] shrink-0 min-w-[180px] bg-[var(--bg-main)] p-4 max-md:w-full">
            <div className="h-6 w-[70%] bg-gray-300 rounded mb-5 animate-pulse" />
            <div className="space-y-3">
              {[100, 85, 90, 75, 95].map((w, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded animate-pulse" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <main className="flex-1 min-w-0">
            <div className="w-full h-64 rounded-[2%] border border-double border-[var(--border-color)] overflow-hidden animate-pulse"
              style={{ background: 'url("/test1.jpg")', backgroundSize: "cover" }} />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center text-white text-center px-4"
        style={{ background: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("/books.jpeg")', backgroundSize: "cover", backgroundPosition: "center" }}>
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!book) return null;

  const page = book.pages?.[currentPage] || { blocks: [], references: [] };

  return (
    <div dir={dir} className="flex flex-col h-screen overflow-hidden">

      {/* ── Header ── */}
      <header
        className="text-white py-6 px-8 text-center shrink-0"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/books.jpeg")',
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl leading-tight break-words text-center truncate text-wrap">
          {book.title}
        </h1>
      </header>

      {/* ── Navbar ── */}
      <nav className="bg-[var(--bg-main)] px-6 py-3 z-10 shrink-0 border-b border-[var(--border-color)] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
        <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-6">
          <li><Link className="nav-link" to={lang === "ar" ? "/ar" : "/"}>{lang === "ar" ? "الرئيسية" : "Home"}</Link></li>
          <li><Link className="nav-link" to={lang === "ar" ? "/library_ar" : "/library"}>{lang === "ar" ? "المكتبة" : "Library"}</Link></li>
          <li><Link className="nav-link" to={`/books/${lang}/${slug}`}>{labels.back}</Link></li>
        </ul>
      </nav>

      {/* ── Body row ── */}
      <div className="flex flex-row flex-1 overflow-hidden">

        {/* ── Sidebar column ── */}
        <div
          className={`
            shrink-0 bg-[var(--bg-main)] border-e border-[var(--border-color)] overflow-y-auto
            w-[22%] min-w-[180px]
            max-md:fixed max-md:inset-y-0 max-md:start-0 max-md:w-[75vw] max-md:max-w-[300px]
            max-md:z-50 max-md:shadow-xl max-md:transition-transform max-md:duration-300
            ${sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
            ${isArabic && !sidebarOpen ? "max-md:translate-x-full" : ""}
            ${isArabic && sidebarOpen ? "max-md:translate-x-0" : ""}
          `}
        >
          <div className="p-4 max-md:pt-16">
            <Sidebar
              open={sidebarOpen}
              chapters={book.chapters}
              setCurrentPage={(p) => { goToPage(p); setSidebarOpen(false); }}
              currentPage={currentPage}
              pages={book.pages}
              tocLabel={labels.toc}
              isRTL={isArabic}
            />
          </div>
        </div>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 max-md:block hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Main content column ── */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-16">

          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden flex items-center gap-2 text-[0.85rem] text-[var(--primary)] bg-transparent border-none cursor-pointer px-4 py-2 shrink-0"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle table of contents"
            aria-expanded={sidebarOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="18" y2="18" />
            </svg>
            {sidebarOpen ? (isArabic ? "إخفاء الفهرس" : "Hide Contents") : (isArabic ? "عرض الفهرس" : "Contents")}
          </button>

          {/* ── Action bar ── */}
          <div className="flex items-center gap-2 px-3 pt-2 pb-1 flex-wrap">
            {isArabic && (
              <>
                <button
                  className="bg-[#0c0c0c] text-white border-none px-4 py-1.5 rounded-full cursor-pointer text-[0.85rem] hover:bg-[#ef0000f6] transition-colors"
                  onClick={() => setIsTashkeelRemoved((p) => !p)}
                >
                  {isTashkeelRemoved ? "استعادة التشكيل" : "إزالة التشكيل"}
                </button>

                {page.audioUrl && (
                  <button
                    onClick={() => handleAudioToggle(page.audioUrl)}
                    title="تشغيل الصوت"
                    aria-label={isPlaying ? "إيقاف الصوت" : "تشغيل الصوت"}
                    className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-2.5 py-1.5 flex items-center justify-center h-8 transition-all duration-200 hover:text-[#0077cc] hover:border-[#0077cc] hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" width="18" height="18" style={{ transform: "scaleX(-1)" }}>
                      {isPlaying
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M10 9h2v6h-2zM14 9h2v6h-2z" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 5.25 6.75 9H4.5v6h2.25l4.5 3.75V5.25z M16.5 8.25a3.75 3.75 0 010 7.5 m2.25-10.5a7.5 7.5 0 010 13.5" />
                      }
                    </svg>
                  </button>
                )}
              </>
            )}

            {/* Share button */}
            <button
              onClick={handleShare}
              title={isArabic ? "شارك" : "Share"}
              aria-label={isArabic ? "شارك" : "Share this page"}
              className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-2.5 py-1.5 flex items-center justify-center h-8 transition-all duration-200 hover:text-[#0077cc] hover:border-[#0077cc] hover:scale-105"
            >
              <FiShare2 size={16} />
            </button>

            {/* Report button — same style as share */}
            <button
              onClick={() => setReportOpen(true)}
              title={isArabic ? "الإبلاغ عن مشكلة" : "Report an issue"}
              aria-label={isArabic ? "الإبلاغ عن مشكلة" : "Report an issue"}
              className="bg-white border border-[#ccc] text-[#333] rounded-[8px] cursor-pointer px-2.5 py-1.5 flex items-center justify-center h-8 transition-all duration-200 hover:text-[#c3a421] hover:border-[#c3a421] hover:scale-105"
            >
              <Flag size={15} />
            </button>
          </div>

          {/* Book content */}
          <div className="px-3 pb-2">
            <BookContent
              blocks={page.blocks || []}
              references={page.references || []}
              fontSize={fontSize}
              removeTashkeel={isTashkeelRemoved}
              lang={lang}
            />
          </div>
        </main>
      </div>

      {/* Fixed Controls bar */}
      <Controls
        currentPage={currentPage}
        totalPages={book.pages ? book.pages.length : 0}
        setCurrentPage={goToPage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isRTL={isArabic}
      />

      {/* Report modal */}
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        lang={lang}
        contentType="book_page"
        bookId={book._id}
        chapterNumber={book.chapters[page.chapterIndex]?.number}
        pageNumber={page.number}
      />
    </div>
  );
}