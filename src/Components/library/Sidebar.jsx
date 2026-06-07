// src/Components/library/Sidebar.jsx

// Converts Western digits (0-9) to Arabic-Indic digits (٠-٩)
const toArabicNumerals = (n) =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

export default function Sidebar({
  open,
  chapters,
  setCurrentPage,
  currentPage,
  pages,
  tocLabel,
  isRTL = false,
}) {
  return (
    /*
      dir="rtl" ensures the sidebar text, alignment, and spacing are correct
      for Arabic regardless of any parent container direction.
    */
    <aside dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="text-[1.1rem] text-[var(--text-main)] mb-4 font-semibold">
        {tocLabel}
      </h2>

      <nav className="space-y-0.5">
        {chapters.map((chapter, idx) => {
          const firstPageIdx = Array.isArray(pages)
            ? pages.findIndex((p) => p.chapterIndex === idx)
            : -1;

          const lastPageIdx = Array.isArray(pages)
            ? pages.reduce((last, p, i) => (p.chapterIndex === idx ? i : last), -1)
            : -1;

          const chapterPageCount =
            firstPageIdx !== -1 && lastPageIdx !== -1
              ? lastPageIdx - firstPageIdx + 1
              : 0;

          const isActive = Array.isArray(pages)
            ? pages[currentPage]?.chapterIndex === idx
            : false;

          const progressWithinChapter =
            isActive && chapterPageCount > 0
              ? ((currentPage - firstPageIdx + 1) / chapterPageCount) * 100
              : 0;

          return (
            <button
              type="button"
              key={idx}
              onClick={() => {
                if (firstPageIdx !== -1) setCurrentPage(firstPageIdx);
              }}
              className={`
                block w-full no-underline py-[0.5rem] px-2 text-[0.9rem]
                rounded-[4px] transition-colors duration-200
                bg-transparent border-none cursor-pointer
                ${isRTL ? "text-right" : "text-left"}
                ${
                  isActive
                    ? "text-[var(--text-main)] font-semibold bg-[var(--bg-light)]"
                    : "text-[var(--text-accent)] hover:text-[var(--text-main)] hover:bg-[var(--bg-light)]"
                }
              `}
            >
              <span className="block leading-snug">{chapter.title}</span>

              {/* Page count — Arabic numerals + Arabic word in RTL */}
              {chapterPageCount > 0 && (
                <span className="block text-[0.65rem] text-[var(--text-secondary)] mt-0.5">
                  {isRTL
                    ? `${toArabicNumerals(chapterPageCount)} صفحة`
                    : `${chapterPageCount} ${chapterPageCount === 1 ? "page" : "pages"}`
                  }
                </span>
              )}

              {/* Mini progress bar — only for the active chapter */}
              {isActive && chapterPageCount > 0 && (
                <div className="mt-1.5 h-[2px] w-full bg-[var(--border-color)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                    style={{ width: `${progressWithinChapter}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}