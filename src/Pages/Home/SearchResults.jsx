import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/search?q=${encodeURIComponent(query)}&page=${page}`
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
    <div className="search-page">
      <div className="search-container">
        <h1 className="search-title">Search results for: “{query}”</h1>

        {loading && <p className="search-loading">Loading results...</p>}
        {error && <p className="search-error">{error}</p>}

        {!loading && results.length === 0 && !error && (
          <p className="search-empty">No results found for “{query}”.</p>
        )}

        {results.length > 0 && (
          <>
            {results.map((item) => (
              <div key={item._id} className="search-result-item">
                <h2>{item.heading || item.question}</h2>
                <p>{item.answer?.slice(0, 200)}...</p>
                <button
                  onClick={() => navigate(`/questions/${item.slug}`)}
                  className="read-more-btn"
                >
                  Read More →
                </button>
              </div>
            ))}

            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                ← Previous
              </button>

              <p>
                Page {page} of {totalPages}
              </p>

              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
