export default function Controls({
  currentPage,
  totalPages,
  setCurrentPage,
  setFontSize,
}) {
  const btnClass = [
    // mobile: smaller padding + text
    "px-2 py-1 text-xs",
    // sm+: original sizing
    "sm:px-3 sm:py-[0.4rem] sm:text-sm",
    // shared
    "border border-[#ccc] rounded-[4px]",
    "text-[var(--button-text-color)]",
    "cursor-pointer font-[inherit]",
    "transition-all duration-150",
    "hover:bg-white hover:border-[var(--primary)] hover:text-[var(--text-main)] hover:font-semibold",
  ].join(" ");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-2 sm:py-3 mb-4 mt-2 px-2">
      {/* Font size group */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setFontSize((f) => Math.max(0.8, f - 0.1))}
          className={btnClass}
          style={{ background: "var(--button-gradient)" }}
          title="Decrease font size"
        >
          A−
        </button>
        <button
          onClick={() => setFontSize((f) => f + 0.1)}
          className={btnClass}
          style={{ background: "var(--button-gradient)" }}
          title="Increase font size"
        >
          A+
        </button>
      </div>

      {/* Divider — visible on sm+ */}
      <span className="hidden sm:block w-px h-5 bg-[#ccc]" />

      {/* Page navigation group */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
          className={btnClass}
          style={{ background: "var(--button-gradient)" }}
          title="Previous page"
        >
          ‹
        </button>

        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage + 1}
          onChange={(e) => {
            let val = parseInt(e.target.value, 10) - 1;
            if (val >= 0 && val < totalPages) setCurrentPage(val);
          }}
          className="w-[40px] sm:w-[55px] px-1 sm:px-2 py-1 sm:py-[0.4rem] border border-[#ccc] rounded-[4px] bg-white text-center font-[inherit] text-xs sm:text-sm"
        />

        <span className="text-[0.65rem] sm:text-xs text-[var(--text-secondary)] whitespace-nowrap">
          / {totalPages}
        </span>

        <button
          onClick={() =>
            currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)
          }
          className={btnClass}
          style={{ background: "var(--button-gradient)" }}
          title="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
