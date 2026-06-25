import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";
import QuestionItemSkeleton from "../common/QuestionItemSkeleton";
import SearchBar from "../common/SearchBarQuestion";
import Pagination from "./Pagination";
import { useSearchParams } from "react-router-dom";
import { Inbox, AlertTriangle } from "lucide-react";
import { searchFatwas } from "../../api/searchqa";

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

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTotalItems, setSearchTotalItems] = useState(0);

  const itemsPerPage = 5;
  const isRTL = direction === "rtl";
  const lang = isRTL ? "ar" : "en";

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const activeSearch = searchParams.get("q") || "";
  const isSearchMode = activeSearch.trim().length > 0;

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

    const controller = new AbortController();

    const loadSearchResults = async () => {
      try {
        setSearchLoading(true);
        setError("");

        const data = await searchFatwas({
          query: activeSearch,
          page: currentPage,
          limit: itemsPerPage,
          lang,
          signal: controller.signal,
        });

        setDisplayedFatwas(data.results || []);
        setSearchTotalItems(data.totalItems || data.total || 0);
      } catch (error) {
        if (error.name === "AbortError") return;
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

    return () => controller.abort();
  }, [isSearchMode, activeSearch, currentPage, lang, isRTL]);

  const setCurrentPage = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", page);
      return next;
    });
  };

  const submitSearch = (query) => {
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

  const clearSearch = () => {
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
              {!showLoading && (
                <span className="text-gray-500"> ({searchTotalItems})</span>
              )}
            </>
          ) : (
            <>
              {isRTL ? "عدد الإجابات:" : "Total Answers:"}{" "}
              {displayedFatwas.length}
            </>
          )}
        </span>
      </div>

      {/* Sticky so the search bar stays reachable while scrolling a long
          list of results. top-0 assumes nothing else (e.g. a fixed Navbar)
          is already pinned above this section on the page — if it is,
          bump this to match that header's height instead. */}
      <div className="sticky top-0 z-20 bg-[var(--bg-main)] my-8 py-1">
        <SearchBar
          direction={direction}
          placeholder={searchPlaceholder}
          initialValue={activeSearch}
          onSubmit={submitSearch}
        />
      </div>

      <div id="fatwaList">
        {showLoading ? (
          <div>
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <QuestionItemSkeleton key={i} direction={direction} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <AlertTriangle size={32} className="text-red-500" />
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
            <Inbox size={32} className="text-[var(--bg-color-header)]" />

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
