export default function Sidebar({
  open,
  chapters,
  setCurrentPage,
  currentPage,
  pages,
  tocLabel,
}) {
  return (
    <aside className="">
      <h2 className="text-[1.2rem] text-[var(--text-main)] mb-4 font-semibold">
        {tocLabel}
      </h2>

      {chapters.map((chapter, idx) => {
        const firstPageIdx = Array.isArray(pages)
          ? pages.findIndex((p) => p.chapterIndex === idx)
          : -1;

        const isActive = Array.isArray(pages)
          ? pages[currentPage]?.chapterIndex === idx
          : false;

        return (
          <button
            type="button"
            key={idx}
            onClick={() => {
              if (firstPageIdx !== -1) setCurrentPage(firstPageIdx);
            }}
            className={`block w-full text-left no-underline py-[0.4rem] text-[0.95rem] overflow-auto transition-colors duration-200 bg-transparent border-none cursor-pointer
              ${
                isActive
                  ? "text-[var(--text-main)] font-semibold bg-[var(--bg-light)] rounded-[4px] px-2"
                  : "text-[var(--text-accent)] hover:text-[var(--text-main)]"
              }`}
          >
            {chapter.title}
          </button>
        );
      })}
    </aside>
  );
}