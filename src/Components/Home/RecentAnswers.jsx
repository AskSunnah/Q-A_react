import React, { useEffect, useRef, useState } from "react";
import QuestionItem from "./QuestionItem";
import Pagination from "./Pagination";
import { useSearchParams } from "react-router-dom";
import { getSearchSuggestions, searchFatwas } from "../../api/searchqa";

const RecentAnswers = ({
  fetchFatwas,
  sectionTitle = "Recent Answers",
  searchPlaceholder = "Search...",
  questionLabel = "Q",
  direction = "ltr",
}) => {
  const [fatwas, setFatwas] = useState([]);
  const [displayedFatwas, setDisplayedFatwas] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTotalItems, setSearchTotalItems] = useState(0);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const suggestionBoxRef = useRef(null);

  const itemsPerPage = 5;
  const isRTL = direction === "rtl";
  const lang = isRTL ? "ar" : "en";

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const activeSearch = searchParams.get("q") || "";
  const isSearchMode = activeSearch.trim().length > 0;

  useEffect(() => {
    setSearchText(activeSearch);
  }, [activeSearch]);

  useEffect(() => {
    const loadFatwas = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchFatwas();
        const reversed = data.slice().reverse();

        setFatwas(reversed);
      } catch (error) {
        console.error("Failed to load fatwas:", error);
        setFatwas([]);
        setDisplayedFatwas([]);
        setError(
          isRTL ? "حدث خطأ أثناء تحميل الأسئلة." : "Failed to load questions.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadFatwas();
  }, [fetchFatwas, isRTL]);

  useEffect(() => {
    if (!isSearchMode) {
      setDisplayedFatwas(fatwas);
      setSearchTotalItems(0);
    }
  }, [isSearchMode, fatwas]);

  useEffect(() => {
    if (!isSearchMode) return;

    const loadSearchResults = async () => {
      try {
        setSearchLoading(true);
        setError("");

        const data = await searchFatwas({
          query: activeSearch,
          page: currentPage,
          limit: itemsPerPage,
          lang,
        });

        setDisplayedFatwas(data.results || []);
        setSearchTotalItems(data.totalItems || data.total || 0);
      } catch (error) {
        console.error("Search failed:", error);
        setDisplayedFatwas([]);
        setSearchTotalItems(0);
        setError(
          isRTL
            ? "حدث خطأ أثناء البحث. حاول مرة أخرى."
            : "Search failed. Please try again.",
        );
      } finally {
        setSearchLoading(false);
      }
    };

    loadSearchResults();
  }, [isSearchMode, activeSearch, currentPage, lang, isRTL]);

  useEffect(() => {
    const query = searchText.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSuggestionLoading(true);

        const data = await getSearchSuggestions({
          query,
          lang,
          limit: 6,
        });

        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error("Suggestions failed:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSuggestionLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, lang]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setCurrentPage = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", page);
      return next;
    });
  };

  const submitSearch = (queryValue = searchText) => {
    const query = queryValue.trim();

    setShowSuggestions(false);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (query) {
        next.set("q", query);
      } else {
        next.delete("q");
      }

      next.set("page", "1");
      return next;
    });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      submitSearch();
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const selectedText = suggestion.heading || suggestion.question || "";

    setSearchText(selectedText);
    submitSearch(selectedText);
  };

  const clearSearch = () => {
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("q");
      next.set("page", "1");
      return next;
    });

    setDisplayedFatwas(fatwas);
    setSearchTotalItems(0);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedFatwas = isSearchMode
    ? displayedFatwas
    : displayedFatwas.slice(startIndex, startIndex + itemsPerPage);

  const totalItemsForPagination = isSearchMode
    ? searchTotalItems
    : displayedFatwas.length;

  const showLoading = isSearchMode ? searchLoading : loading;

  return (
    <section aria-labelledby="recent-answers" dir={direction}>
      <div className={isRTL ? "text-right" : "text-left"}>
        <h3
          id="recent-answers"
          className="m-0 text-[1.15rem] font-bold text-[var(--bg-color-header)]"
        >
          {isSearchMode
            ? isRTL
              ? "نتائج البحث"
              : "Search Results"
            : sectionTitle}
        </h3>

        <span className="text-[0.95rem] block mt-2">
          {isSearchMode ? (
            <>
              {isRTL ? "نتائج البحث عن:" : "Search results for:"}{" "}
              <strong>“{activeSearch}”</strong>
            </>
          ) : (
            <>
              {isRTL ? "عدد الإجابات:" : "Total Answers:"}{" "}
              {displayedFatwas.length}
            </>
          )}
        </span>
      </div>

      <div
        ref={suggestionBoxRef}
        className="
          relative my-8 rounded-xl border border-[#e6dcc5]
          bg-[#fffdf8] px-4 py-4
          shadow-[0_4px_14px_rgba(0,0,0,0.05)]
          focus-within:border-[var(--bg-color-header)]
          transition-all
        "
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-[var(--bg-color-header)] text-[1.1rem]">
              ⌕
            </span>

            <input
              type="text"
              id="fatwaSearch"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              dir={direction}
              autoComplete="off"
              className={`
                w-full bg-transparent
                text-[0.9rem] sm:text-base
                outline-none
                placeholder:text-[#9a8f7a]
                ${isRTL ? "text-right" : "text-left"}
              `}
            />
          </div>

          <div className={`flex gap-2 ${isRTL ? "justify-end" : ""}`}>
            <button
              type="button"
              onClick={() => submitSearch()}
              className="
                rounded-full
                bg-[var(--bg-color-header)]
                text-white text-[0.85rem]
                px-5 py-2 font-medium
                hover:brightness-110 transition
              "
            >
              {isRTL ? "بحث" : "Search"}
            </button>

            {searchText && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  rounded-full bg-[#f3ead6]
                  px-4 py-2 text-[0.85rem] font-medium
                  text-[var(--bg-color-header)]
                  hover:bg-[#ead9b5]
                  transition
                "
              >
                {isRTL ? "مسح" : "Clear"}
              </button>
            )}
          </div>
        </div>

        {showSuggestions && (
          <div
            className={`
              absolute left-4 right-4 top-[calc(100%-8px)]
              z-30 overflow-hidden rounded-xl
              border border-[#eadfca] bg-white
              shadow-[0_10px_30px_rgba(0,0,0,0.12)]
              ${isRTL ? "text-right" : "text-left"}
            `}
          >
            {suggestionLoading ? (
              <div className="px-4 py-3 text-[0.9rem] text-[#7a6a4a]">
                {isRTL ? "جاري عرض الاقتراحات..." : "Loading suggestions..."}
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion) => {
                const title = suggestion.heading || suggestion.question;

                return (
                  <button
                    key={suggestion._id || suggestion.slug}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`
                      block w-full px-4 py-3
                      text-[0.9rem] text-[#3a2c0f]
                      hover:bg-[#fff7e6]
                      border-b border-[#f1eadb] last:border-b-0
                      ${isRTL ? "text-right" : "text-left"}
                    `}
                  >
                    <span className="block font-medium line-clamp-2">
                      {title}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-[0.9rem] text-[#7a6a4a]">
                {isRTL ? "لا توجد اقتراحات." : "No suggestions found."}
              </div>
            )}
          </div>
        )}
      </div>

      <div id="fatwaList">
        {showLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-[50px] h-[50px] rounded-full animate-spin border-[5px] border-[var(--bg-color-header)] border-t-transparent" />
            <p className="text-[var(--bg-color-header)] font-medium text-[0.95rem]">
              {isRTL
                ? isSearchMode
                  ? "جاري البحث..."
                  : "جاري تحميل الأسئلة..."
                : isSearchMode
                  ? "Searching..."
                  : "Loading questions..."}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <span className="text-[2rem]">⚠️</span>
            <p className="text-red-600 font-semibold text-[1rem]">{error}</p>
          </div>
        ) : paginatedFatwas.length > 0 ? (
          paginatedFatwas.map((item, index) => (
            <QuestionItem
              key={item._id || item.slug || index}
              index={startIndex + index}
              item={item}
              labelPrefix={questionLabel}
              direction={direction}
              currentPage={currentPage}
              highlightQuery={activeSearch}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <span className="text-[2rem]">📭</span>

            <p className="text-[var(--bg-color-header)] font-semibold text-[1rem]">
              {isRTL ? "لم يتم العثور على إجابات." : "No answers found."}
            </p>

            {isSearchMode && (
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
                {isRTL ? "عرض كل الإجابات" : "Show all answers"}
              </button>
            )}
          </div>
        )}
      </div>

      <Pagination
        totalItems={totalItemsForPagination}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default RecentAnswers;
