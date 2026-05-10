import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config";

import axios from "axios";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🧠 Detect if search query is Arabic
  const isArabic = /[\u0600-\u06FF]/.test(query);

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        // Pass lang param dynamically
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
    <div className={`search-page ${isArabic ? "rtl" : "ltr"}`}>
      <div className="search-container">
        <h1 className="search-title">
          <h1 className="search-title">
  {isArabic ? "نتائج البحث عن:" : "Search results for:"} 
  &nbsp;<span dir="ltr">&ldquo;{query}&rdquo;</span>
</h1>

        </h1>

        {loading && (
          <p className="search-loading">
            {isArabic ? "جارٍ تحميل النتائج..." : "Loading results..."}
          </p>
        )}
        {error && (
          <p className="search-error">
            {isArabic ? "حدث خطأ أثناء تحميل النتائج." : error}
          </p>
        )}

        {!loading && results.length === 0 && !error && (
          <p className="search-empty">
            {isArabic
              ? `لم يتم العثور على نتائج لـ “${query}”.`
              : `No results found for “${query}”.`}
          </p>
        )}

        {results.length > 0 && (
          <>
            {results.map((item) => (
              <div key={item._id} className="search-result-item">
                <h2>{item.heading || item.question}</h2>
                <p>{item.answer?.slice(0, 200)}...</p>
                <button
                 onClick={() =>
  navigate(`/questions/${item.slug}${isArabic ? "?lang=ar" : ""}`)
}
                  className="read-more-btn"
                >
                  {isArabic ? "اقرأ مزيدًا ←" : "Read More →"}
                </button>
              </div>
            ))}

            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                {isArabic ? "← السابق" : "← Previous"}
              </button>

              <p>
                {isArabic
                  ? `الصفحة ${page} من ${totalPages}`
                  : `Page ${page} of ${totalPages}`}
              </p>

              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
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
