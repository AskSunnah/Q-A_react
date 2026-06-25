import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config";
import { AlertTriangle, Inbox } from "lucide-react";
import Navbar from "./../../Components/common/Navbar";
import Footer from "./../../Components/common/Footer";
import QuestionItemSkeleton from "./../../Components/common/QuestionItemSkeleton";
import SearchBar from "./../../Components/common/SearchBarQuestion";

import axios from "axios";

const enNavItems = [
  { label: "Home", href: "/", internal: true },
  { label: "Library", href: "/library", internal: true },
  { label: "About Us", href: "/about", internal: true },
  { label: "Feedback", href: "/feedback", internal: true },
  { label: "Contribute", href: "/contribute", internal: true },
];

const arNavItems = [
  { label: "الرئيسية", href: "/ar", internal: true },
  { label: "المكتبة", href: "/library_ar", internal: true },
  { label: "عن الموقع", href: "/about-us/ar", internal: true },
  { label: "شاركنا رأيك", href: "/feedback-ar", internal: true },
  { label: "ساهم", href: "/ar/contribute", internal: true },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Detect if search query is Arabic
  const isArabic = /[\u0600-\u06FF]/.test(query);
  const direction = isArabic ? "rtl" : "ltr";

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const lang = isArabic ? "ar" : "en";
        const res = await axios.get(
          `${API_BASE}/api/search?q=${encodeURIComponent(
            query,
          )}&page=${page}&lang=${lang}`,
          { signal: controller.signal },
        );

        setResults(res.data.results || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Search fetch failed:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [query, page]);

  const handlePageChange = (newPage) => {
    navigate(
      `${isArabic ? "/ar" : ""}/search?q=${encodeURIComponent(query)}&page=${newPage}`,
    );
  };

  const handleNewSearch = (q) => {
    navigate(
      `${isArabic ? "/ar" : ""}/search?q=${encodeURIComponent(q)}&page=1`,
    );
  };

  return (
    <>
      <Navbar
        dir={direction}
        navItems={isArabic ? arNavItems : enNavItems}
        languageSwitcher={
          isArabic
            ? { label: "English", href: "/" }
            : { label: "العربية", href: "/ar" }
        }
      />

      <main
        aria-label="Search Results"
        dir={direction}
        className={`
          max-w-[900px] mx-auto my-8 px-6 py-6
          bg-[var(--bg-main)] text-[var(--text-main)]
          rounded-[10px] shadow-[2px_3px_12px_rgba(0,0,0,0.14)]
          max-md:px-4 max-md:py-4 max-md:mx-4 max-md:bg-white max-md:rounded-none max-md:shadow-none
          ${isArabic ? "text-right [font-family:'Tajawal','Cairo',sans-serif]" : "text-left"}
        `}
      >
        <h1 className="text-[1.5rem] font-bold text-[var(--bg-color-header)] mb-2">
          {isArabic ? "نتائج البحث عن:" : "Search results for:"}
          &nbsp;<span dir="ltr">&ldquo;{query}&rdquo;</span>
        </h1>

        {!loading && (
          <p className="text-[0.9rem] text-gray-500 mb-6">
            {isArabic
              ? `${results.length} نتيجة`
              : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </p>
        )}

        <div className="mb-8">
          <SearchBar
            direction={direction}
            placeholder={isArabic ? "ابحث..." : "Search..."}
            initialValue={query}
            onSubmit={handleNewSearch}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <QuestionItemSkeleton key={i} direction={direction} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <AlertTriangle size={32} className="text-red-500" />
            <p className="text-red-600 font-semibold text-base">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Inbox size={32} className="text-[var(--bg-color-header)]" />
            <p className="text-[var(--bg-color-header)] font-semibold text-base">
              {isArabic
                ? `لم يتم العثور على نتائج لـ "${query}".`
                : `No results found for "${query}".`}
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            {results.map((item) => (
              <div
                key={item._id}
                className={`
                  bg-[#fffdf8] border border-[#e8e0cf] rounded-[12px] px-6 py-5 mb-6
                  transition-all duration-200 ease-in-out overflow-hidden
                  hover:border-[var(--bg-color-header)] hover:shadow-[0_2px_10px_rgba(40,115,70,0.15)]
                  ${isArabic ? "text-right" : "text-left"}
                `}
              >
                <h2 className="text-[1.15rem] font-semibold text-[#3a2c0f] mb-2">
                  {item.heading || item.question}
                </h2>
                <p className="text-[#444] leading-relaxed text-[0.95rem]">
                  {item.answer?.slice(0, 200)}...
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/questions/${item.slug}${isArabic ? "?lang=ar" : ""}`,
                    )
                  }
                  className={`
                    inline-block mt-3 text-white text-[0.9rem] border-none
                    px-[1.1rem] py-[0.45rem] rounded-[6px] cursor-pointer
                    transition-all duration-200 ease-in-out hover:brightness-110
                    bg-[var(--bg-color-header)]
                    ${isArabic ? "float-left" : ""}
                  `}
                >
                  {isArabic ? "اقرأ مزيدًا ←" : "Read More →"}
                </button>

                {/* clearfix for Arabic float */}
                {isArabic && <div className="clear-both" />}
              </div>
            ))}

            {/* Pagination */}
            <div
              className={`flex items-center justify-between mt-10
                ${isArabic ? "flex-row-reverse text-right" : ""}
              `}
            >
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="bg-[#f3e8c6] border-none rounded-[6px] text-[#4a3a0b] font-medium px-5 py-2 cursor-pointer transition-all duration-200 hover:bg-[#e6d497] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isArabic ? "← السابق" : "← Previous"}
              </button>

              <p className="text-[var(--bg-color-header)] font-medium">
                {isArabic
                  ? `الصفحة ${page} من ${totalPages}`
                  : `Page ${page} of ${totalPages}`}
              </p>

              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="bg-[#f3e8c6] border-none rounded-[6px] text-[#4a3a0b] font-medium px-5 py-2 cursor-pointer transition-all duration-200 hover:bg-[#e6d497] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isArabic ? "التالي →" : "Next →"}
              </button>
            </div>
          </>
        )}
      </main>

      <Footer lang={isArabic ? "ar" : "en"} />
    </>
  );
};

export default SearchResults;
