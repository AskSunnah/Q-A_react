import React, { useEffect, useState } from "react";
import { fetchBooks } from "../../api/books.js";
import Navbar from "../../Components/Navbar";
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
const LIMIT = 9;

export default function BookLibrary({ lang = "en" }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
    setBooks([]);
  }, [lang, debouncedSearch, category]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        page === 1 ? setLoading(true) : setLoadingMore(true);
        setError("");

        const data = await fetchBooks(
          lang,
          page,
          LIMIT,
          debouncedSearch,
          category
        );

        const cleanedBooks = data.books.map((b) => ({
          ...b,
          category: b.category ? b.category.toLowerCase() : "uncategorized",
        }));

        setBooks((prev) =>
          page === 1 ? cleanedBooks : [...prev, ...cleanedBooks]
        );

        setHasMore(data.hasMore);
      } catch (err) {
        console.error("Error loading books:", err);
        setError(
          lang === "ar"
            ? "حدث خطأ أثناء تحميل الكتب."
            : "Something went wrong while loading books."
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    loadBooks();
  }, [lang, page, debouncedSearch, category]);

  const getBookLink = (slug) => `/library/read/${lang}/${slug}`;

  const handleDownload = async (bookId) => {
    try {
      const res = await fetch(`${API_BASE}/api/books/${bookId}/download`);
      const data = await res.json();

      if (!res.ok || !data.downloadUrl) {
        alert("No download link available for this book.");
        return;
      }

      window.location.href = data.downloadUrl;
    } catch (err) {
      console.error("Error downloading:", err);
      alert("Something went wrong while downloading.");
    }
  };

  const getCategoryLabel = (value) => {
    const opts = CATEGORY_OPTIONS[lang] || CATEGORY_OPTIONS.en;
    const found = opts.find((o) => o.value === value);
    return found ? found.label : value || "—";
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
      <header className="bg-[var(--bg-lib-header)] text-white pt-10 pb-10 px-4 text-center font-bold">
        <h1 className="text-[2rem]">
          {lang === "ar" ? "الكتب العربية" : "English Books"}
        </h1>
      </header>

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

      <div className="max-w-[1090px] mx-auto my-8 p-6 rounded-[12px] bg-[var(--bg-light)] text-[var(--text-main)]">
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <input
            type="text"
            placeholder={
              lang === "ar" ? "ابحث في الكتب..." : "Search English books..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-[400px] bg-white border border-[#e5e7eb] rounded-[8px] py-[0.6rem] px-4 text-[1rem] outline-none shadow-sm"
            style={{
              direction: dir,
              textAlign: lang === "ar" ? "right" : "left",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full max-w-[240px] bg-white border border-[#e5e7eb] rounded-[8px] py-[0.6rem] px-4 text-[1rem] outline-none shadow-sm cursor-pointer"
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-[70px] h-[70px] rounded-full animate-spin border-[7px] border-[var(--bg-color-header)] border-t-[7px] border-t-[var(--text-accent)]" />
            <p className="mt-4 text-[var(--text-main)] font-medium">
              {lang === "ar" ? "جاري تحميل الكتب..." : "Loading books..."}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 font-medium">
            {error}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-main)] font-medium">
            {lang === "ar" ? "لا توجد كتب متاحة." : "No books found."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 mt-2">
              {books.map((book) => (
                <div
                  key={book.slug}
                  className="bg-white rounded-[10px] text-[var(--text-main)] flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#e9e0c8] overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                >
                  <div
                    className="h-1 w-full"
                    style={{ background: "var(--button-gradient)" }}
                  />

                  <div className="p-4 flex flex-col flex-1">
                    <span className="self-start text-[0.7rem] font-semibold uppercase tracking-wide bg-[#fef3c7] text-[#92400e] px-2 py-[2px] rounded-full mb-3">
                      {getCategoryLabel(book.category)}
                    </span>

                    <div className="text-[1.05rem] font-bold mb-1 leading-snug">
                      {book.title}
                    </div>

                    <div className="text-[0.85rem] text-[var(--text-secondary)] mb-4">
                      {book.author || "Unknown Author"}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <a
                        href={getBookLink(book.slug)}
                        className="flex-1 text-center bg-[#c9a227] text-black py-[0.5rem] px-3 rounded-[6px] no-underline font-bold text-[0.85rem] hover:opacity-80"
                      >
                        {READ_LABEL[lang]}
                      </a>

                      <button
                        onClick={() => handleDownload(book._id)}
                        className="flex-1 bg-[#1f6f3e] text-white border-none py-[0.5rem] px-3 rounded-[6px] cursor-pointer text-[0.85rem] hover:opacity-80"
                      >
                        {DOWNLOAD_LABEL[lang]}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loadingMore}
                  className="bg-[#c9a227] text-black px-6 py-2 rounded font-bold hover:opacity-80 disabled:opacity-60"
                >
                  {loadingMore
                    ? lang === "ar"
                      ? "جاري التحميل..."
                      : "Loading..."
                    : lang === "ar"
                    ? "تحميل المزيد"
                    : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}