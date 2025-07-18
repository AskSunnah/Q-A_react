import { useEffect, useState } from "react";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 500);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (totalPages <= 1) return null;

  const createBtn = (label, page, isActive = false, key = label) => (
    <a
      key={key}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onPageChange(page);
        document.getElementById('fatwaList')?.scrollIntoView({ behavior: 'smooth' });
      }}
      className={`pagination-btn ${isActive ? 'active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      style={{ whiteSpace: "nowrap" }}
    >
      {label}
    </a>
  );

  const renderButtons = () => {
    const buttons = [];

    const showDots = (key) => <span key={key} style={{ padding: "0.4rem" }}>...</span>;

    // Previous
    if (currentPage > 1) {
      buttons.push(createBtn("<", currentPage - 1, false, "prev"));
    }

    // Always show first
    buttons.push(createBtn(1, 1, currentPage === 1, "first"));

    // Mid section
    if (isSmallScreen) {
      if (currentPage > 2) {
        buttons.push(showDots("dots-left"));
      }

      if (currentPage !== 1 && currentPage !== totalPages) {
        buttons.push(createBtn(currentPage, currentPage, true, "current"));
      }

      if (currentPage < totalPages - 1) {
        buttons.push(showDots("dots-right"));
      }
    } else {
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        buttons.push(showDots("dots-left"));
      }

      for (let i = start; i <= end; i++) {
        buttons.push(createBtn(i, i, currentPage === i, `page-${i}`));
      }

      if (end < totalPages - 1) {
        buttons.push(showDots("dots-right"));
      }
    }

    // Always show last
    if (totalPages > 1) {
      buttons.push(createBtn(totalPages, totalPages, currentPage === totalPages, "last"));
    }

    // Next
    if (currentPage < totalPages) {
      buttons.push(createBtn(">", currentPage + 1, false, "next"));
    }

    return buttons;
  };

  return (
    <div
      className="pagination"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.3rem",
        marginTop: "2rem",
        flexWrap: "nowrap",
        padding: "0 0.5rem",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {renderButtons()}
    </div>
  );
};

export default Pagination;
