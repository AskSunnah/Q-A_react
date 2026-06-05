import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";
import Pagination from "./Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";

const RecentAnswers = ({
  fetchFatwas,
  sectionTitle = "Recent Answers",
  searchPlaceholder = "Search...",
  questionLabel = "Q",
  direction = "ltr",
}) => {
  const [fatwas, setFatwas] = useState([]);
  const [filteredFatwas, setFilteredFatwas] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  // Read page from URL, default to 1
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const setCurrentPage = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", page);
      return next;
    });
  };

  useEffect(() => {
    const loadFatwas = async () => {
      try {
        setLoading(true);
        const data = await fetchFatwas();
        const reversed = data.slice().reverse();
        setFatwas(reversed);
        setFilteredFatwas(reversed);
      } catch (error) {
        console.error("Failed to load fatwas:", error);
        setFatwas([]);
        setFilteredFatwas([]);
      } finally {
        setLoading(false);
      }
    };
    loadFatwas();
  }, [fetchFatwas]);

  const navigate = useNavigate();
  const isRTL = direction === "rtl";

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        e.target.value = "";
      }
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFatwas = filteredFatwas.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <section aria-labelledby="recent-answers" dir={direction}>
      <div className={isRTL ? "text-right" : "text-left"}>
        <h3
          id="recent-answers"
          className="m-0 text-[1.15rem] font-bold text-[var(--bg-color-header)]"
        >
          {sectionTitle}
        </h3>
        <span className="text-[0.95rem] block mt-2">
          {isRTL ? "عدد الإجابات:" : "Total Answers:"} {filteredFatwas.length}
        </span>
      </div>

      <div className="my-8">
        <input
          type="text"
          id="fatwaSearch"
          placeholder={searchPlaceholder}
          onKeyDown={handleSearch}
          dir={direction}
          className={`
    w-full

    px-3 sm:px-4
    py-2.5 sm:py-3

    border border-[#ccc]
    rounded-[6px]

    text-[0.9rem] sm:text-base

    outline-none
    focus:border-[var(--bg-color-header)]

    ${isRTL ? "text-right" : "text-left"}
  `}
        />
      </div>

      {/* <div id="fatwaList">
        {paginatedFatwas.length > 0 ? (
          paginatedFatwas.map((item, index) => (
            <QuestionItem
              key={index}
              index={startIndex + index}
              item={item}
              labelPrefix={questionLabel}
              direction={direction}
              currentPage={currentPage}
            />
          ))
        ) : (
          <p className="text-red-600">
            {isRTL ? "❌ لم يتم العثور على إجابات." : "❌ No answers found."}
          </p>
        )}
      </div> */}

      <div id="fatwaList">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-[50px] h-[50px] rounded-full animate-spin border-[5px] border-[var(--bg-color-header)] border-t-transparent" />
            <p className="text-[var(--bg-color-header)] font-medium text-[0.95rem]">
              {isRTL ? "جاري تحميل الأسئلة..." : "Loading questions..."}
            </p>
          </div>
        ) : paginatedFatwas.length > 0 ? (
          paginatedFatwas.map((item, index) => (
            <QuestionItem
              key={index}
              index={startIndex + index}
              item={item}
              labelPrefix={questionLabel}
              direction={direction}
              currentPage={currentPage}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <span className="text-[2rem]">📭</span>
            <p className="text-[var(--bg-color-header)] font-semibold text-[1rem]">
              {isRTL ? "لم يتم العثور على إجابات." : "No answers found."}
            </p>
          </div>
        )}
      </div>
      <Pagination
        totalItems={filteredFatwas.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default RecentAnswers;
