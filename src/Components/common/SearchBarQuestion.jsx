// Components/Shared/SearchBarQuestion.jsx
import React, { useEffect, useRef, useState } from "react";
import { getSearchSuggestions } from "../../api/searchqa";

const SearchBarQuestion = ({
  direction = "ltr",
  placeholder = "Search...",
  initialValue = "",
  onSubmit, // (query: string) => void
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const boxRef = useRef(null);
  const abortRef = useRef(null);

  const isRTL = direction === "rtl";
  const lang = isRTL ? "ar" : "en";

  useEffect(() => {
    const query = searchText.trim();
    setActiveIndex(-1);

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setSuggestionLoading(true);
        const data = await getSearchSuggestions({
          query,
          lang,
          limit: 6,
          signal: controller.signal,
        });
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        setSuggestionLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, lang]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submit = (value = searchText) => {
    const q = value.trim();
    setShowSuggestions(false);
    if (q) onSubmit(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        const s = suggestions[activeIndex];
        const text = s.heading || s.question;
        setSearchText(text);
        submit(text);
      } else {
        submit();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div
      ref={boxRef}
      className="
        relative rounded-xl border border-[#e6dcc5]
        bg-[#fffdf8] px-4 py-3
        shadow-[0_4px_14px_rgba(0,0,0,0.05)]
        focus-within:border-[var(--bg-color-header)]
        transition-all
      "
    >
      <div className="flex items-center gap-3">
        <span className="text-[var(--bg-color-header)] text-[1.1rem]">⌕</span>
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          dir={direction}
          autoComplete="off"
          className={`w-full bg-transparent text-[0.9rem] sm:text-base outline-none placeholder:text-[#9a8f7a] ${isRTL ? "text-right" : "text-left"}`}
        />
        <button
          type="button"
          onClick={() => submit()}
          className="rounded-full bg-[var(--bg-color-header)] text-white text-[0.85rem] px-4 py-1.5 font-medium hover:brightness-110 transition shrink-0"
        >
          {isRTL ? "بحث" : "Search"}
        </button>
      </div>

      {showSuggestions && (
        <div className="absolute left-4 right-4 top-[calc(100%-4px)] z-30 overflow-hidden rounded-xl border border-[#eadfca] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          {suggestionLoading ? (
            <div className="px-4 py-3 text-[0.9rem] text-[#7a6a4a]">
              {isRTL ? "جاري عرض الاقتراحات..." : "Loading suggestions..."}
            </div>
          ) : (
            suggestions.map((s, i) => (
              <button
                key={s._id || s.slug}
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  const text = s.heading || s.question;
                  setSearchText(text);
                  submit(text);
                }}
                className={`block w-full px-4 py-3 text-[0.9rem] text-[#3a2c0f] border-b border-[#f1eadb] last:border-b-0 ${isRTL ? "text-right" : "text-left"} ${i === activeIndex ? "bg-[#fff7e6]" : "hover:bg-[#fff7e6]"}`}
              >
                <span className="block font-medium line-clamp-2">
                  {s.heading || s.question}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBarQuestion;
