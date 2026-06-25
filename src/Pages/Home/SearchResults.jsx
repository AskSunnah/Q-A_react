import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle, Inbox } from "lucide-react";

import Navbar from "./../../Components/common/Navbar";
import Footer from "./../../Components/common/Footer";
import Header from "./../../Components/Home/Header";
import QuestionItemSkeleton from "./../../Components/common/QuestionItemSkeleton";
import SearchBarQuestion from "./../../Components/common/SearchBarQuestion";
import QuestionItem from "./../../Components/Home/QuestionItem";
import Pagination from "./../../Components/Home/Pagination";

import { searchFatwas } from "./../../api/searchqa";

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
  const location = useLocation();

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const pathIsArabic = location.pathname.startsWith("/ar");
  const queryIsArabic = /[\u0600-\u06FF]/.test(query);
  const isArabic = pathIsArabic || queryIsArabic;

  const direction = isArabic ? "rtl" : "ltr";
  const lang = isArabic ? "ar" : "en";

  const [results, setResults] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalItems(0);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchFatwas({
          query,
          page,
          limit: itemsPerPage,
          lang,
          signal: controller.signal,
        });

        setResults(data.results || []);
        setTotalItems(data.totalItems || data.total || 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search fetch failed:", err);
          setResults([]);
          setTotalItems(0);
          setError(
            isArabic
              ? "حدث خطأ أثناء تحميل نتائج البحث."
              : "Failed to fetch search results. Please try again.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [query, page, lang, isArabic]);

  const getSearchBasePath = (searchQuery = query) => {
    const newQueryIsArabic = /[\u0600-\u06FF]/.test(searchQuery);
    return newQueryIsArabic || isArabic ? "/ar/search" : "/search";
  };

  const handlePageChange = (newPage) => {
    navigate(
      `${getSearchBasePath()}?q=${encodeURIComponent(query)}&page=${newPage}`,
    );
  };

  const handleNewSearch = (newQuery) => {
    navigate(
      `${getSearchBasePath(newQuery)}?q=${encodeURIComponent(newQuery)}&page=1`,
    );
  };

  const clearSearch = () => {
    navigate(isArabic ? "/ar" : "/", { replace: true });
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
        <div className={isArabic ? "text-right" : "text-left"}>
          <h1 className="m-0 text-[1.15rem] sm:text-[1.4rem] font-bold text-[var(--bg-color-header)]">
            {isArabic ? "نتائج البحث" : "Search Results"}
          </h1>

          {query && (
            <span className="text-[0.95rem] block mt-2">
              {isArabic ? "نتائج البحث عن:" : "Search results for:"}{" "}
              <strong>“{query}”</strong>
            </span>
          )}

          {!loading && query && (
            <span className="text-[0.9rem] text-gray-500 block mt-2">
              {isArabic
                ? `${totalItems} نتيجة`
                : `${totalItems} result${totalItems === 1 ? "" : "s"}`}
            </span>
          )}

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="
                mt-3 rounded-full bg-[#f3ead6]
                px-4 py-2 text-[0.85rem] font-medium
                text-[var(--bg-color-header)]
                hover:bg-[#ead9b5]
                transition
              "
            >
              {isArabic ? "عرض كل الإجابات" : "Show all answers"}
            </button>
          )}
        </div>

        <div className="my-8">
          <SearchBarQuestion
            direction={direction}
            placeholder={isArabic ? "ابحث..." : "Search..."}
            initialValue={query}
            isSearchMode={Boolean(query)}
            onSubmit={handleNewSearch}
            onClear={clearSearch}
          />
        </div>

        {loading && (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <QuestionItemSkeleton key={i} direction={direction} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <AlertTriangle size={32} className="text-red-500" />
            <p className="text-red-600 font-semibold text-base">{error}</p>
          </div>
        )}

        {!loading && !error && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Inbox size={32} className="text-[var(--bg-color-header)]" />
            <p className="text-[var(--bg-color-header)] font-semibold text-base">
              {isArabic
                ? `لم يتم العثور على نتائج لـ "${query}".`
                : `No results found for "${query}".`}
            </p>

            <button
              type="button"
              onClick={clearSearch}
              className="
                mt-2 rounded-full bg-[#f3ead6]
                px-4 py-2 text-[0.85rem] font-medium
                text-[var(--bg-color-header)]
                hover:bg-[#ead9b5]
                transition
              "
            >
              {isArabic ? "عرض كل الإجابات" : "Show all answers"}
            </button>
          </div>
        )}

        {!loading && !error && !query && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <Inbox size={32} className="text-[var(--bg-color-header)]" />
            <p className="text-[var(--bg-color-header)] font-semibold text-base">
              {isArabic
                ? "اكتب كلمة للبحث في الأسئلة."
                : "Type a keyword to search questions."}
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <div id="fatwaList">
              {results.map((item, index) => (
                <QuestionItem
                  key={item._id || item.slug || index}
                  index={(page - 1) * itemsPerPage + index}
                  item={item}
                  labelPrefix={isArabic ? "س" : "Q"}
                  direction={direction}
                  currentPage={page}
                  highlightQuery={query}
                />
              ))}
            </div>

            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <Footer lang={isArabic ? "ar" : "en"} />
    </>
  );
};

export default SearchResults;
