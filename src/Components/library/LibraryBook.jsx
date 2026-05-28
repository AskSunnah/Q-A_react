import React, { useEffect, useState } from "react";
import { fetchBooks } from "../../api/books.js";
import Navbar from '../../Components/Navbar';
import { API_BASE } from "../../../config";



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

const READ_LABEL = { en: "Read Book", ar: "اقرأ الكتاب" };
const DOWNLOAD_LABEL = { en: "Download (Free)", ar: "تحميل (مجاني)" };

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
          })),
        );
      })
      .catch(() => setBooks([]));
  }, [lang]);

  useEffect(() => {
    let filtered = books.filter(
      (b) =>
        (category === "all" || b.category === category) &&
        (b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())),
    );
    setDisplayBooks(filtered);
  }, [search, category, books]);

  const getBookLink = (slug) => `/library/read/${lang}/${slug}`;

const handleDownload = async (bookId) => {
  try {
    const res = await fetch(
      `${API_BASE}/api/books/${bookId}/download`
    );
    const data = await res.json();

    if (!res.ok || !data.downloadUrl) {
      alert("No download link available for this book.");
      return;
    }

    // Use same tab instead of opening a new one
    window.location.href = data.downloadUrl;
  } catch (err) {
    console.error("Error downloading:", err);
    alert("Something went wrong while downloading.");
  }
};

  const getCategoryLabel = (value) => {
    const opts = CATEGORY_OPTIONS[lang] || CATEGORY_OPTIONS.en;
    const found = opts.find((o) => o.value === value);
    if (found) return found.label;

    // Try to map using the English list as a fallback (keeps indexes aligned)
    const enFound = CATEGORY_OPTIONS.en.find((o) => o.value === value);
    if (enFound) {
      const idx = CATEGORY_OPTIONS.en.indexOf(enFound);
      const alt = CATEGORY_OPTIONS[lang] && CATEGORY_OPTIONS[lang][idx];
      if (alt) return alt.label;
      return enFound.label;
    }

    return value || "—";
  };

  return (
    <div
      dir={dir}
      className="m-0 min-h-screen font-[var(--font-family)]"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url("/books.jpeg")',
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >
      {/* header */}
      <header className="bg-[var(--bg-lib-header)] text-white pt-10 pb-10 px-4 text-center font-bold">
        <h1 className="text-[2rem]">
          {lang === "ar" ? "الكتب العربية" : "English Books"}
        </h1>
      </header>

      {/* Navbar */}
      {lang === "ar" ? (
        <Navbar
          dir="rtl"
          navItems={[
            { label: "الرئيسية", href: "/ar", internal: true },
            { label: "المكتبة", href: "/library_ar", internal: true },
            { label: "عن الموقع", href: "/about-us/ar", internal: true },
            { label: "شاركنا رأيك", href: "/feedback-ar", internal: true },
            { label: "ساهم", href: "/contribute", internal: true },
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
            { label: "Contribute", href: "/contribute", internal: true },
          ]}
          languageSwitcher={{ label: "العربية", href: "/library/arabicbooks" }}
        />
      )}

      {/* container */}
      <div className="max-w-[1090px] mx-auto my-8 p-6 rounded-[12px] bg-[var(--bg-light)] text-[var(--text-main)]">
        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-[400px] mx-auto sm:mx-0">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#999]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder={
                lang === "ar" ? "ابحث في الكتب..." : "Search English books..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#e5e7eb] rounded-[8px] py-[0.6rem] pl-9 pr-4 text-[1rem] outline-none shadow-sm"
              style={{
                direction: dir,
                textAlign: lang === "ar" ? "right" : "left",
              }}
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex-1 max-w-[240px] mx-auto sm:mx-0">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#999]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h18M6 8h12M9 12h6"
                />
              </svg>
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-[#e5e7eb] rounded-[8px] py-[0.6rem] pl-9 pr-4 text-[1rem] outline-none shadow-sm appearance-none cursor-pointer"
              style={{
                direction: dir,
                textAlign: lang === "ar" ? "right" : "left",
              }}
            >
              {CATEGORY_OPTIONS[lang].map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 mt-2">
          {displayBooks.length === 0 ? (
            <p></p>
          ) : (
            displayBooks.map((book) => (
              <div
                key={book.slug}
                data-category={book.category}
                className="bg-white rounded-[10px] text-[var(--text-main)] flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#e9e0c8] overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
              >
                {/* Top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: "var(--button-gradient)" }}
                />

                <div className="p-4 flex flex-col flex-1">
                  {/* Category badge */}
                  <span className="self-start text-[0.7rem] font-semibold uppercase tracking-wide bg-[#fef3c7] text-[#92400e] px-2 py-[2px] rounded-full mb-3">
                    {getCategoryLabel(book.category)}
                  </span>

                  {/* Title */}
                  <div className="text-[1.05rem] font-bold mb-1 leading-snug">
                    {book.title}
                  </div>

                  {/* Author */}
                  <div className="text-[0.85rem] text-[var(--text-secondary)] mb-4 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.121 17.804A4 4 0 0 1 8 17h8a4 4 0 0 1 2.879 1.804M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                      />
                    </svg>
                    {book.author}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    {/* Read Book */}
                    <a
                      href={getBookLink(book.slug)}
                      className="flex items-center gap-[6px] flex-1 justify-center bg-[#c9a227] text-black py-[0.5rem] px-3 rounded-[6px] no-underline font-bold text-[0.85rem] transition-opacity duration-200 hover:opacity-80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      {READ_LABEL[lang]}
                    </a>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(book._id)}
                      className="flex items-center gap-[6px] flex-1 justify-center bg-[#1f6f3e] text-white border-none py-[0.5rem] px-3 rounded-[6px] cursor-pointer font-normal text-[0.85rem] transition-opacity duration-200 hover:opacity-80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 15V3"
                        />
                      </svg>
                      {DOWNLOAD_LABEL[lang]}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
