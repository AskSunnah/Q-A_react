import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

const RecentAnswers = ({
  fetchFatwas,
  sectionTitle = "Recent Answers",
  searchPlaceholder = "Search...",
  questionLabel = "Q",
  direction = "ltr",
}) => {
  const [fatwas, setFatwas] = useState([]);
  const [filteredFatwas, setFilteredFatwas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadFatwas = async () => {
      try {
        const data = await fetchFatwas();
        const reversed = data.slice().reverse();
        setFatwas(reversed);
        setFilteredFatwas(reversed);
      } catch (error) {
        console.error("Failed to load fatwas:", error);
        setFatwas([]);
        setFilteredFatwas([]);
      }
    };
    loadFatwas();
  }, [fetchFatwas]);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        e.target.value = "";
      }
    }
  };
  const isRTL = direction === "rtl";

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

      <div id="fatwaList">
        {paginatedFatwas.length > 0 ? (
          paginatedFatwas.map((item, index) => (
            <QuestionItem
              key={index}
              index={startIndex + index}
              item={item}
              labelPrefix={questionLabel}
              direction={direction}
            />
          ))
        ) : (
          <p className="text-red-600">
            {isRTL ? "❌ لم يتم العثور على إجابات." : "❌ No answers found."}
          </p>
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
