import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config";

import axios from "axios";

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

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const lang = isArabic ? "ar" : "en";
        const res = await axios.get(
          `${API_BASE}/api/search?q=${encodeURIComponent(
            query
          )}&page=${page}&lang=${lang}`
        );

        console.log("Search API response:", res.data);

        setResults(res.data.results || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Search fetch failed:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  const handlePageChange = (newPage) => {
    navigate(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
  };

  return (
    <div
      className={`bg-[#fdfbf7] min-h-screen py-12 px-4 flex justify-center
        ${isArabic ? "direction-rtl text-right [font-family:'Tajawal','Cairo',sans-serif]" : "direction-ltr text-left"}`}
      style={{ direction: isArabic ? "rtl" : "ltr" }}
    >
      <div className="bg-white rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] max-w-[900px] w-full p-10 border border-[#f0e7d3]">
        {/* Title */}
        <h1 className="text-[1.8rem] font-semibold text-[#6a4c0f] mb-6 border-b-2 border-[#e6d497] pb-2">
          {isArabic ? "نتائج البحث عن:" : "Search results for:"}
          &nbsp;<span dir="ltr">&ldquo;{query}&rdquo;</span>
        </h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-[#555] text-base mt-12">
            {isArabic ? "جارٍ تحميل النتائج..." : "Loading results..."}
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-[#555] text-base mt-12">
            {isArabic ? "حدث خطأ أثناء تحميل النتائج." : error}
          </p>
        )}

        {/* Empty */}
        {!loading && results.length === 0 && !error && (
          <p className="text-center text-[#555] text-base mt-12">
            {isArabic
              ? `لم يتم العثور على نتائج لـ "${query}".`
              : `No results found for "${query}".`}
          </p>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            {results.map((item) => (
              <div
                key={item._id}
                className={`
                  bg-[#fffdf8] border border-[#e8e0cf] rounded-[12px] px-6 py-5 mb-6
                  transition-all duration-200 ease-in-out overflow-hidden
                  hover:border-[#d4b45a] hover:shadow-[0_2px_10px_rgba(212,180,90,0.25)]
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
                    ${
                      isArabic
                        ? "float-left bg-gradient-to-l from-[#b8912f] to-[#d4b45a] px-[1.3rem] rounded-[8px] font-semibold"
                        : "bg-gradient-to-r from-[#b8912f] to-[#d4b45a]"
                    }
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

              <p className="text-[#6a4c0f] font-medium">
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
      </div>
    </div>
  );
};

export default SearchResults;
