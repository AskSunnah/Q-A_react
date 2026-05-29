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
        const isActive = firstPageIdx === currentPage;
        return (
          <a
            href="#"
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              if (firstPageIdx !== -1) setCurrentPage(firstPageIdx);
            }}
            className={`block no-underline py-[0.4rem] text-[0.95rem] overflow-auto transition-colors duration-200
              ${
                isActive
                  ? "text-[var(--text-main)] font-semibold bg-[var(--bg-light))] rounded-[4px] pl-2"
                  : "text-[var(--text-accent)] hover:text-[var(--text-main)]"
              }`}
          >
            {chapter.title}
          </a>
        );
      })}
    </aside>
  );
}
