export default function Sidebar({ open,chapters, setCurrentPage, currentPage, pages, tocLabel }) {
  return (
    <aside className={`sidebar${open ? " open" : ""}`}>
      <h2>{tocLabel}</h2>
      {chapters.map((chapter, idx) => {
        const firstPageIdx = Array.isArray(pages)
          ? pages.findIndex(p => p.chapterIndex === idx)
          : -1;
        const isActive = firstPageIdx === currentPage;
        return (
          <a
            href="#"
            key={idx}
            className={isActive ? "active" : ""}
            onClick={e => {
              e.preventDefault();
              if (firstPageIdx !== -1) setCurrentPage(firstPageIdx);
            }}
          >
            {chapter.title}
          </a>
        );
      })}
    </aside>
  );
}
