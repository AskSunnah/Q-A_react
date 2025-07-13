import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const createBtn = (label, page, isActive = false) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onPageChange(page);
        document.getElementById('fatwaList')?.scrollIntoView({ behavior: 'smooth' });
      }}
      className={`pagination-btn ${isActive ? 'active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </a>
  );

  const renderButtons = () => {
    let buttons = [];

    if (currentPage > 1) {
      buttons.push(createBtn('<', currentPage - 1));
    }

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(createBtn(i, i, i === currentPage));
      }
    } else {
      buttons.push(createBtn(1, 1, currentPage === 1));

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) buttons.push(<span key="dot-start">...</span>);

      for (let i = start; i <= end; i++) {
        buttons.push(createBtn(i, i, i === currentPage));
      }

      if (end < totalPages - 1) buttons.push(<span key="dot-end">...</span>);

      buttons.push(createBtn(totalPages, totalPages, currentPage === totalPages));
    }

    if (currentPage < totalPages) {
      buttons.push(createBtn('>', currentPage + 1));
    }

    return buttons;
  };

  return (
    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      {renderButtons()}
    </div>
  );
};

export default Pagination;
