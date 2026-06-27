import React, { useEffect, useRef, useState, useCallback } from "react";
import { fetchBooks, fetchAuthors } from "../../api/books.js";
import Navbar from "../../Components/common/Navbar";
import { API_BASE } from "../../../config";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = {
  en: [
    { value: "all", label: "All categories" },
    { value: "aqeedah", label: "Aqeedah" },
    { value: "seerah", label: "Seerah" },
    { value: "hadith", label: "Hadith" },
    { value: "fiqh", label: "Fiqh" },
  ],
  ar: [
    { value: "all", label: "كل التصنيفات" },
    { value: "aqeedah", label: "عقيدة" },
    { value: "seerah", label: "سيرة" },
    { value: "hadith", label: "حديث" },
    { value: "fiqh", label: "فقه" },
  ],
};

const SORT_OPTIONS = {
  en: [
    { value: "order", label: "Default order" },
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "title_asc", label: "Title (A–Z)" },
    { value: "title_desc", label: "Title (Z–A)" },
    { value: "author_asc", label: "Author (A–Z)" },
    { value: "author_desc", label: "Author (Z–A)" },
  ],
  ar: [
    { value: "order", label: "الترتيب الافتراضي" },
    { value: "newest", label: "الأحدث أولاً" },
    { value: "oldest", label: "الأقدم أولاً" },
    { value: "title_asc", label: "العنوان (أ–ي)" },
    { value: "title_desc", label: "العنوان (ي–أ)" },
    { value: "author_asc", label: "المؤلف (أ–ي)" },
    { value: "author_desc", label: "المؤلف (ي–أ)" },
  ],
};

const T = {
  read: { en: "Read", ar: "اقرأ" },
  download: { en: "Download", ar: "تحميل" },
  allAuthors: { en: "All authors", ar: "كل المؤلفين" },
  reset: { en: "Reset filters", ar: "إعادة ضبط" },
  searchPH: {
    en: "Search books, authors, topics…",
    ar: "ابحث في الكتب، المؤلفين، المواضيع…",
  },
  loading: { en: "Loading books…", ar: "جاري تحميل الكتب…" },
  loadingMore: { en: "Loading…", ar: "جاري التحميل…" },
  viewMore: { en: "View more", ar: "عرض المزيد" },
  noBooks: {
    en: "More books are on the way!",
    ar: "المزيد من الكتب قادم قريبًا!",
  },

  noBooksBody: {
    en: "We're continuously expanding our library with new books and resources. If you couldn't find what you were looking for today, please check back soon—we're adding more content regularly.",
    ar: "نعمل باستمرار على توسيع مكتبتنا وإضافة المزيد من الكتب والموارد. إذا لم تجد ما تبحث عنه اليوم، فنأمل أن تزورنا مرة أخرى قريبًا، فالمزيد من المحتوى يُضاف باستمرار.",
  },
  clearSearch: { en: "Clear search", ar: "مسح البحث" },
  activeFilters: { en: "Active filters:", ar: "فلاتر نشطة:" },
  searchingLabel: { en: "searching", ar: "جاري…" },
  showingResultsFor: { en: "Showing results for", ar: "نتائج عن" },
  didYouMean: { en: "Did you mean", ar: "هل تقصد" },
  noExactMatch: { en: "No exact match.", ar: "لا توجد نتائج مطابقة." },
  tryTips: { en: "Try:", ar: "جرّب:" },
  tip1: { en: "Check the spelling", ar: "تحقق من الإملاء" },
  tip2: { en: "Search by author name", ar: "ابحث باسم المؤلف" },
  tip3: { en: "Remove one or more filters", ar: "أزل أحد عوامل التصفية" },
};

const LIMIT = 9;

// ─── Suggestion type icons ────────────────────────────────────────────────────

function SuggestionIcon({ type }) {
  if (type === "author") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 shrink-0 text-[#c9a227]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  }
  if (type === "category") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 shrink-0 text-[#c9a227]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 7h.01M7 3h5l5.586 5.586a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A2 2 0 013 11.586V7a4 4 0 014-4z"
        />
      </svg>
    );
  }
  // title (default)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3.5 h-3.5 shrink-0 text-[#c9a227]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

// ─── Chip — dismissible active-filter pill ────────────────────────────────────
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.73rem] font-medium bg-[#fff7e0] text-[#7a5000] border border-[#e8c84a] px-2.5 py-[3px] rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="text-[#a07820] hover:text-[#c9a227] transition-colors leading-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-2.5 h-2.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
}

// ─── CustomSelect ─────────────────────────────────────────────────────────────
function CustomSelect({
  value,
  onChange,
  options = [],
  groups,
  placeholder = "Select…",
  showSearch = false,
  searchPlaceholder = "Filter…",
  dir = "ltr",
  minWidth = "130px",
  maxWidth,
  dropdownWidth = "260px",
}) {
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open && showSearch && searchRef.current)
      setTimeout(() => searchRef.current?.focus(), 40);
    if (!open) setFilterText("");
  }, [open, showSearch]);

  const allOptions = groups ? groups.flatMap((g) => g.options) : options;
  const isActive = value && value !== "all" && value !== "order";

  const currentLabel = isActive
    ? placeholder
    : (allOptions.find((o) => o.value === value)?.label ?? placeholder);
  const hasValue = value && allOptions.some((o) => o.value === value);
  const showIndicator = hasValue && value !== "all" && value !== "order";

  const matchesFilter = (label) =>
    !filterText || label.toLowerCase().includes(filterText.toLowerCase());
  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  const OptionRow = ({ option }) => {
    if (!matchesFilter(option.label)) return null;
    const isActive = option.value === value;
    return (
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleSelect(option.value);
        }}
        className={`w-full flex items-center gap-2 px-3 py-[7px] text-[13px] text-[#3a2000] ${
          dir === "rtl" ? "text-right" : "text-left"
        } cursor-pointer transition-colors duration-75 ${
          isActive ? "bg-[#fef3c7] font-semibold" : "hover:bg-[#fef9ed]"
        }`}
        style={{ direction: dir }}
      >
        <span
          className="flex-1 break-words whitespace-normal"
          title={option.label}
        >
          {option.label}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 text-[#c9a227] shrink-0 transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    );
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ minWidth, maxWidth }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full h-[38px] flex items-center gap-1.5 px-3 pr-8 rounded-[8px] border bg-white text-[13px] font-medium text-[#3a2000] text-left cursor-pointer outline-none select-none transition-all duration-150 ${open ? "border-[#c9a227] ring-2 ring-[#c9a227]/20" : "border-[#e6dcc5] hover:border-[#c9a227]"}`}
        style={{ direction: dir }}
      >
        {showIndicator && (
          <span className="w-[7px] h-[7px] rounded-full bg-[#c9a227] shrink-0" />
        )}
        <span className="flex-1 truncate">{currentLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-3 text-[#c9a227] absolute right-[10px] top-1/2 -translate-y-1/2 transition-transform duration-150 pointer-events-none ${open ? "rotate-180" : "rotate-0"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute top-[calc(100%+5px)] ${
            dir === "rtl" ? "right-0" : "left-0"
          } z-50 bg-white border border-[#e6dcc5] rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] overflow-hidden`}
          style={{
            minWidth: "100%",
            width: dropdownWidth,
            maxWidth: "min(90vw, 320px)",
          }}
          role="listbox"
        >
          {showSearch && (
            <div className="p-2 pb-1">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#c9a227] pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-[32px] pl-7 pr-3 rounded-[6px] border border-[#e6dcc5] bg-[#faf8f3] text-[12.5px] text-[#3a2000] outline-none focus:border-[#c9a227]"
                  dir={dir}
                />
              </div>
            </div>
          )}
          <div className="max-h-[220px] overflow-y-auto py-1">
            {groups ? (
              groups.map((group) => {
                const visible = group.options.filter((o) =>
                  matchesFilter(o.label),
                );
                if (!visible.length) return null;
                return (
                  <div key={group.label}>
                    <p className="px-3 pt-2 pb-0.5 text-[10.5px] font-bold uppercase tracking-widest text-[#b8a98a]">
                      {group.label}
                    </p>
                    {visible.map((o) => (
                      <OptionRow key={o.value} option={o} />
                    ))}
                  </div>
                );
              })
            ) : (
              <>
                {allOptions
                  .filter((o) => matchesFilter(o.label))
                  .map((o) => (
                    <OptionRow key={o.value} option={o} />
                  ))}
                {showSearch &&
                  filterText &&
                  !allOptions.some((o) => matchesFilter(o.label)) && (
                    <p className="px-3 py-2.5 text-[12.5px] text-[#a08050] italic">
                      No results for "{filterText}"
                    </p>
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SearchSuggestions dropdown ───────────────────────────────────────────────
function SearchSuggestions({ suggestions, onSelect, dir, visible }) {
  if (!visible || !suggestions.length) return null;
  const typeLabel = (type) => {
    if (dir === "rtl") {
      if (type === "author") return "مؤلف";
      if (type === "category") return "تصنيف";
      return "كتاب";
    }

    if (type === "author") return "Author";
    if (type === "category") return "Category";
    return "Book";
  };

  return (
    <div
      className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white border border-[#e6dcc5] rounded-[10px] shadow-[0_6px_24px_rgba(0,0,0,0.13)] overflow-hidden"
      dir={dir}
    >
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(s);
          }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-[9px] ${
            dir === "rtl" ? "text-right" : "text-left"
          } hover:bg-[#fef9ed] transition-colors border-b border-[#f5f0e5] last:border-0`}
        >
          <SuggestionIcon type={s.type} />
          <span
            className={`flex-1 text-[13px] text-[#3a2000] font-medium truncate ${
              dir === "rtl" ? "text-right" : "text-left"
            }`}
          >
            {s.label}
          </span>
          <span className="text-[10.5px] text-[#c4b08a] font-medium shrink-0">
            {typeLabel(s.type)}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── FuzzyBanner ──────────────────────────────────────────────────────────────
// Shown above results when the search term was fuzzy-corrected automatically.
function FuzzyBanner({ correction, originalTerm, lang, onDismiss }) {
  if (!correction) return null;
  const label =
    lang === "ar"
      ? `يتم عرض نتائج عن: "${correction}"`
      : `Showing results for: "${correction}"`;

  return (
    <div className="flex items-center gap-2.5 mb-4 px-3.5 py-2.5 rounded-[8px] bg-[#fef9ed] border border-[#e8c84a]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 shrink-0 text-[#c9a227]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <p className="text-[0.8rem] text-[#7a5000] flex-1">{label}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="text-[0.75rem] text-[#a07820] hover:text-[#c9a227] font-medium transition-colors underline underline-offset-2"
      >
        {lang === "ar"
          ? `بحث عن "${originalTerm}"`
          : `Search for "${originalTerm}" instead`}
      </button>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({
  lang,
  hasActiveFilters,
  debouncedSearch,
  fuzzyCorrection,
  onReset,
  onFuzzyAccept,
  onFuzzyDismiss,
  category,
  author,
  sort,
}) {
  const t = (key) => T[key]?.[lang] ?? T[key]?.en ?? key;
  const hasAnyState = hasActiveFilters || !!debouncedSearch;

  // "Did you mean?" state — fuzzy found a correction but exact search returned 0
  const showDidYouMean = !!fuzzyCorrection && !!debouncedSearch;

  return (
    <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#fef3c7] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-[#c9a227]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <p className="text-[1.05rem] font-semibold text-[var(--text-main)]">
        {t("noBooks")}
      </p>

      {/* Did you mean? */}
      {showDidYouMean && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-[0.82rem] text-[var(--text-secondary)]">
            {t("noExactMatch")}
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[0.82rem] text-[var(--text-secondary)]">
              {t("didYouMean")}
            </span>
            <button
              type="button"
              onClick={() => onFuzzyAccept(fuzzyCorrection)}
              className="
                inline-flex items-center gap-1.5 px-3.5 py-1.5
                bg-[#c9a227] text-[#3a2000] rounded-full
                text-[0.82rem] font-bold
                hover:opacity-90 transition-opacity
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              {fuzzyCorrection}
            </button>
          </div>
        </div>
      )}

      {/* Generic tips when no fuzzy match */}
      {/* {!showDidYouMean && (
        <div className="text-[0.82rem] text-white text-left max-w-[300px]">
  <p className="font-semibold mb-1.5 text-white">{t("tryTips")}</p>
  <ul className="space-y-1 list-none">
    {[t("tip1"), t("tip2"), t("tip3")].map((tip, i) => (
      <li key={i} className="flex items-start gap-2">
        <span className="text-white font-bold mt-0.5">•</span>
        <span className="text-white">{tip}</span>
      </li>
    ))}
  </ul>
</div>
      )} */}

      {hasAnyState && (
        <button
          type="button"
          onClick={onReset}
          className="mt-1 text-[0.82rem] font-semibold text-[#1f6f3e] hover:underline"
        >
          {t("reset")}
        </button>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookLibrary({ lang = "en" }) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = (key) => T[key]?.[lang] ?? T[key]?.en ?? key;

  // Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const suggestAbortRef = useRef(null);

  // Fuzzy correction
  const [fuzzyCorrection, setFuzzyCorrection] = useState(null); // best fuzzy match
  const [fuzzyDismissed, setFuzzyDismissed] = useState(false); // user said "search anyway"
  // When fuzzyAccepted is set the UI shows the FuzzyBanner (auto-corrected result)
  const [fuzzyAccepted, setFuzzyAccepted] = useState(null); // term we auto-searched

  // Filters
  const [category, setCategory] = useState("all");
  const [author, setAuthor] = useState("all");
  const [sort, setSort] = useState("order");
  const [authorOptions, setAuthorOptions] = useState([]);

  // Books
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const isDebouncing =
    search.trim() !== debouncedSearch && search.trim().length >= 2;
  const searchBoxRef = useRef(null);

  // ── Debounce search ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length === 0 || search.trim().length >= 2) {
        setDebouncedSearch(search.trim());
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Live suggestions while typing ─────────────────────────────────────────
  useEffect(() => {
    const term = search.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request
    if (suggestAbortRef.current) suggestAbortRef.current.abort();
    const controller = new AbortController();
    suggestAbortRef.current = controller;

    setSuggestionsLoading(true);
    fetch(
      `${API_BASE}/api/books/suggestions?q=${encodeURIComponent(term)}&lang=${lang}`,
      {
        signal: controller.signal,
      },
    )
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(data.suggestions || []);
        setSuggestionsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setSuggestionsLoading(false);
      });

    return () => controller.abort();
  }, [search, lang]);

  // ── Fuzzy lookup — only when a real search returned 0 results ─────────────
  const lookupFuzzy = useCallback(
    async (term) => {
      if (!term || term.length < 2) {
        setFuzzyCorrection(null);
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE}/api/books/fuzzy?q=${encodeURIComponent(term)}&lang=${lang}`,
        );
        const data = await res.json();
        setFuzzyCorrection(data.correction || null);
      } catch {
        setFuzzyCorrection(null);
      }
    },
    [lang],
  );

  // ── Reset on any filter/lang change ───────────────────────────────────────
  useEffect(() => {
    setPage(1);
    setBooks([]);
    setFuzzyCorrection(null);
    setFuzzyDismissed(false);
    setFuzzyAccepted(null);
  }, [lang, debouncedSearch, category, author, sort]);

  // ── Fetch authors ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetchAuthors(lang)
      .then((list) => {
        if (!cancelled) setAuthorOptions(list);
      })
      .catch(() => {
        if (!cancelled) setAuthorOptions([]);
      });
    setAuthor("all");
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // ── Fetch books ───────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        page === 1 ? setLoading(true) : setLoadingMore(true);
        setError("");
        const data = await fetchBooks(
          lang,
          page,
          LIMIT,
          debouncedSearch,
          category,
          author,
          sort,
        );
        const cleaned = data.books.map((b) => ({
          ...b,
          category: b.category ? b.category.toLowerCase() : "uncategorized",
        }));
        setBooks((prev) => (page === 1 ? cleaned : [...prev, ...cleaned]));
        setHasMore(data.hasMore);

        // If we got 0 results and have a search term, look for fuzzy correction
        if (
          page === 1 &&
          cleaned.length === 0 &&
          debouncedSearch &&
          !fuzzyDismissed
        ) {
          lookupFuzzy(debouncedSearch);
        }
      } catch (err) {
        console.error("Error loading books:", err);
        setError(
          lang === "ar"
            ? "حدث خطأ أثناء تحميل الكتب."
            : "Something went wrong while loading books.",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    load();
  }, [lang, page, debouncedSearch, category, author, sort]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getBookLink = (slug) => `/library/read/${lang}/${slug}`;

  // Wrap setAuthor calls to also clear search:
  const handleAuthorChange = (val) => {
    setAuthor(val);
    if (val !== "all") {
      setSearch("");
      setDebouncedSearch("");
      setSuggestions([]);
      setFuzzyAccepted(null);
    }
  };
  const handleDownload = async (bookId) => {
    try {
      const res = await fetch(`${API_BASE}/api/books/${bookId}/download`);
      const data = await res.json();
      if (!res.ok || !data.downloadUrl) {
        alert("No download link available for this book.");
        return;
      }
      window.location.href = data.downloadUrl;
    } catch {
      alert("Something went wrong while downloading.");
    }
  };

  const getCategoryLabel = (value) => {
    const opts = CATEGORY_OPTIONS[lang] || CATEGORY_OPTIONS.en;
    const found = opts.find((o) => o.value === value);
    if (found) return found.label;
    return (
      CATEGORY_OPTIONS.en.find((o) => o.value === value)?.label ?? value ?? "—"
    );
  };

  const getSortLabel = (value) => {
    const opts = SORT_OPTIONS[lang] || SORT_OPTIONS.en;
    return opts.find((o) => o.value === value)?.label ?? value;
  };

  const hasActiveFilters =
    category !== "all" || author !== "all" || sort !== "order";
  const hasAnyActiveState = hasActiveFilters || !!debouncedSearch;

  const resetFilters = () => {
    setCategory("all");
    setAuthor("all");
    setSort("order");
    setSearch("");
    setDebouncedSearch("");
    setFuzzyCorrection(null);
    setFuzzyDismissed(false);
    setFuzzyAccepted(null);
    setSuggestions([]);
  };

 const handleSuggestionSelect = (suggestion) => {
  setShowSuggestions(false);
  setSuggestions([]);
  setFuzzyAccepted(null);

  if (suggestion.type === "category") {
    // Set the category dropdown, clear the search box
    setCategory(suggestion.value); // value is already "aqeedah", "hadith" etc.
    setSearch("");
    setDebouncedSearch("");
  } else {
    setSearch(suggestion.label);
    setDebouncedSearch(suggestion.label);
  }
};

  // User accepts the fuzzy suggestion → search with the corrected term
  const handleFuzzyAccept = (correction) => {
    setSearch(correction);
    setDebouncedSearch(correction);
    setFuzzyAccepted(correction);
    setFuzzyCorrection(null);
    setFuzzyDismissed(false);
  };

  // User dismisses the fuzzy banner → keep original term, don't suggest again
  const handleFuzzyDismiss = () => {
    setFuzzyDismissed(true);
    setFuzzyAccepted(null);
    setFuzzyCorrection(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      dir={dir}
      className="m-0 font-[var(--font-family)]"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.3)),url("/books.jpeg")',
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >
      <header className="bg-[var(--bg-lib-header)] text-white pt-10 pb-10 px-4 text-center font-bold">
        <h1 className="text-[2rem]">
          {lang === "ar" ? "الكتب العربية" : "English Books"}
        </h1>
      </header>

      {lang === "ar" ? (
        <Navbar
          dir="rtl"
          navItems={[
            { label: "الرئيسية", href: "/ar", internal: true },
            { label: "المكتبة", href: "/library_ar", internal: true },
            { label: "عن الموقع", href: "/about-us/ar", internal: true },
            { label: "شاركنا رأيك", href: "/feedback-ar", internal: true },
            { label: "ساهم", href: "/contribute", internal: true },
          ]}
          languageSwitcher={{ label: "English", href: "/library/engbooks" }}
        />
      ) : (
        <Navbar
          dir="ltr"
          navItems={[
            { label: "Home", href: "/", internal: true },
            { label: "Library", href: "/library", internal: true },
            { label: "About Us", href: "/about-us", internal: true },
            { label: "Feedback", href: "/feedback", internal: true },
            { label: "Contribute", href: "/contribute", internal: true },
          ]}
          languageSwitcher={{ label: "العربية", href: "/library/arabicbooks" }}
        />
      )}

      <div className="max-w-[1090px] mx-auto my-8 p-6 rounded-[12px] bg-[var(--bg-light)] text-[var(--text-main)]">
        {/* ── Search bar ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
          {/* Search input + suggestions wrapper */}
          <div
            className="relative w-full lg:flex-[0_0_42%] xl:flex-[0_0_48%]"
            ref={searchBoxRef}
          >
            <div
              className={`
                flex items-center gap-2.5
                rounded-[10px] border bg-white
                px-4 h-[44px] transition-all duration-200
                ${
                  searchFocused
                    ? "border-[#c9a227] ring-2 ring-[#c9a227]/20 shadow-[0_0_0_3px_rgba(201,162,39,0.10)]"
                    : "border-[#e6dcc5] shadow-sm"
                }
              `}
            >
              {/* Search icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-[15px] h-[15px] shrink-0 transition-colors duration-200 ${searchFocused ? "text-[#c9a227]" : "text-[#b8a98a]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                  setFuzzyAccepted(null);
                  if (author !== "all") setAuthor("all");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setDebouncedSearch(search.trim());
                    setShowSuggestions(false);
                  }
                  if (e.key === "Escape") setShowSuggestions(false);
                }}
                onFocus={() => {
                  setSearchFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setSearchFocused(false);
                  // Small delay so suggestion clicks fire before blur hides them
                  setTimeout(() => setShowSuggestions(false), 120);
                }}
                placeholder={t("searchPH")}
                dir={dir}
                autoComplete="off"
                className={`flex-1 min-w-0 bg-transparent text-[0.875rem] text-[#3a2000] outline-none placeholder:text-[#c4b69a] ${lang === "ar" ? "text-right" : "text-left"}`}
              />

              {isDebouncing && (
                <span className="shrink-0 flex items-center gap-1.5 text-[0.68rem] text-[#b8a064] font-medium">
                  <span className="w-[5px] h-[5px] rounded-full bg-[#c9a227] animate-pulse inline-block" />
                  {t("searchingLabel")}
                </span>
              )}

              {search && !isDebouncing && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDebouncedSearch("");
                    setSuggestions([]);
                    setFuzzyAccepted(null);
                  }}
                  aria-label={t("clearSearch")}
                  className="shrink-0 w-5 h-5 flex items-center justify-center text-[#b8a98a] hover:text-[#c9a227] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setDebouncedSearch(search.trim());
                  setShowSuggestions(false);
                }}
                className="shrink-0 h-[30px] px-4 rounded-full bg-[#c9a227] text-[#3a2000] text-[0.75rem] font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
              >
                {lang === "ar" ? "بحث" : "Search"}
              </button>
            </div>

            {/* ── Live suggestions dropdown ───────────────────────────── */}
            <SearchSuggestions
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              dir={dir}
              visible={showSuggestions && suggestions.length > 0}
            />
          </div>

          {/* ── Dropdowns row ─────────────────────────────────────────── */}
          {/* <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap"> */}
          <div className="flex items-center gap-2 flex-1 flex-nowrap">
            <CustomSelect
              value={category}
              onChange={setCategory}
              placeholder={getCategoryLabel("all")}
              options={CATEGORY_OPTIONS[lang] || CATEGORY_OPTIONS.en}
              dir={dir}
              minWidth="0"
              maxWidth="100%"
            />

            <CustomSelect
              value={author}
              onChange={handleAuthorChange}
              placeholder={t("allAuthors")}
              options={[
                { value: "all", label: t("allAuthors") },
                ...authorOptions.map((name) => ({ value: name, label: name })),
              ]}
              showSearch
              searchPlaceholder={
                lang === "ar" ? "ابحث في المؤلفين…" : "Filter authors…"
              }
              dir={dir}
              minWidth="0"
              maxWidth="100%"
            />

            <CustomSelect
              value={sort}
              onChange={setSort}
              placeholder={getSortLabel("order")}
              groups={[
                {
                  label: lang === "ar" ? "الترتيب" : "Order",
                  options: (SORT_OPTIONS[lang] || SORT_OPTIONS.en).slice(0, 3),
                },
                {
                  label: lang === "ar" ? "العنوان" : "Title",
                  options: (SORT_OPTIONS[lang] || SORT_OPTIONS.en).slice(3, 5),
                },
                {
                  label: lang === "ar" ? "المؤلف" : "Author",
                  options: (SORT_OPTIONS[lang] || SORT_OPTIONS.en).slice(5),
                },
              ]}
              dir={dir}
              minWidth="0"
              maxWidth="none"
              dropdownWidth="135px"
            />
          </div>
        </div>

        {/* ── Active filter chips ───────────────────────────────────────── */}
        {hasAnyActiveState && !loading && (
          <div className="mb-5">
            {/* Header */}
            <div className="flex items-center mb-2">
              <span className="text-[0.7rem] text-white font-semibold uppercase tracking-wide">
                {t("activeFilters")}
              </span>

              <button
                type="button"
                onClick={resetFilters}
                className={`
    inline-flex items-center gap-1.5
    px-3 py-1.5
    rounded-full
    text-[0.72rem]
    font-semibold
    text-[#1f6f3e]
    bg-[#eef9f1]
    border border-[#cfe8d6]
    hover:bg-[#e2f5e8]
    hover:border-[#1f6f3e]
    transition-all duration-200
    ${dir === "rtl" ? "mr-auto" : "ml-auto"}
  `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>

                {lang === "ar" ? "مسح الكل" : "Clear all"}
              </button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {debouncedSearch && (
                <FilterChip
                  label={`"${fuzzyAccepted || debouncedSearch}"`}
                  onRemove={() => {
                    setSearch("");
                    setDebouncedSearch("");
                    setFuzzyAccepted(null);
                  }}
                />
              )}

              {category !== "all" && (
                <FilterChip
                  label={getCategoryLabel(category)}
                  onRemove={() => setCategory("all")}
                />
              )}

              {author !== "all" && (
                <FilterChip label={author} onRemove={() => setAuthor("all")} />
              )}

              {sort !== "order" && (
                <FilterChip
                  label={getSortLabel(sort)}
                  onRemove={() => setSort("order")}
                />
              )}
            </div>
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-[64px] h-[64px] rounded-full animate-spin border-[6px] border-[var(--bg-color-header)] border-t-[var(--text-accent)]" />
            <p className="mt-4 text-[var(--text-main)] font-medium">
              {t("loading")}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 font-medium">
            {error}
          </div>
        ) : books.length === 0 ? (
          <EmptyState
            lang={lang}
            hasActiveFilters={hasActiveFilters}
            debouncedSearch={debouncedSearch}
            fuzzyCorrection={fuzzyCorrection}
            onReset={resetFilters}
            onFuzzyAccept={handleFuzzyAccept}
            onFuzzyDismiss={handleFuzzyDismiss}
            category={category}
            author={author}
            sort={sort}
          />
        ) : (
          <>
            {/* Fuzzy banner — shown when we auto-corrected the query */}
            {fuzzyAccepted && (
              <FuzzyBanner
                correction={fuzzyAccepted}
                originalTerm={search}
                lang={lang}
                onDismiss={handleFuzzyDismiss}
              />
            )}

            {/* Results count when filters are active */}
            {hasAnyActiveState && (
              <p className="text-[0.75rem] text-white font-medium mb-4">
                {lang === "ar"
                  ? `يتم عرض ${books.length} كتاب${hasMore ? "+" : ""}`
                  : `Showing ${books.length} book${books.length !== 1 ? "s" : ""}${hasMore ? "+" : ""}`}
              </p>
            )}

            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              {books.map((book) => (
                <div
                  key={book.slug}
                  data-category={book.category}
                  className="bg-white rounded-[10px] flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.10)] border border-[#e9e0c8] overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
                >
                  <div
                    className="h-[3px] w-full"
                    style={{ background: "var(--button-gradient)" }}
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <span className="self-start text-[0.68rem] font-semibold uppercase tracking-wide bg-[#fef3c7] text-[#92400e] px-2 py-[2px] rounded-full mb-3">
                      {getCategoryLabel(book.category)}
                    </span>
                    <div className="text-[1rem] font-bold mb-1 leading-snug text-[var(--text-main)]">
                      {book.title}
                    </div>
                    <div className="text-[0.82rem] text-[var(--text-secondary)] mb-4 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A4 4 0 018 17h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {book.author ||
                        (lang === "ar" ? "مؤلف غير معروف" : "Unknown author")}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <a
                        href={getBookLink(book.slug)}
                        className="flex items-center gap-1.5 flex-1 justify-center bg-[#c9a227] text-[#3a2000] py-[0.48rem] px-3 rounded-[6px] no-underline font-bold text-[0.82rem] transition-opacity hover:opacity-80"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        {t("read")}
                      </a>
                      <button
                        onClick={() => handleDownload(book._id)}
                        className="flex items-center gap-1.5 flex-1 justify-center bg-[#1f6f3e] text-white border-none py-[0.48rem] px-3 rounded-[6px] cursor-pointer font-normal text-[0.82rem] transition-opacity hover:opacity-80"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                          />
                        </svg>
                        {t("download")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loadingMore}
                  className="bg-[#c9a227] text-[#3a2000] px-6 py-2 rounded font-bold hover:opacity-80 disabled:opacity-60"
                >
                  {loadingMore ? t("loadingMore") : t("viewMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
