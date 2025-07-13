// src/components/ReadBook/Controls.jsx
import React from "react";

export default function Controls({ currentPage, totalPages, setCurrentPage,  setFontSize }) {
  return (
    <div className="controls">
      <button onClick={() => setFontSize(f => Math.max(0.8, f - 0.1))}>-</button>
      <button onClick={() => setFontSize(f => f + 0.1)}>+</button>
      <button onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}>‹</button>
      <input
        type="number"
        min={1}
        max={totalPages}
        value={currentPage + 1}
        onChange={e => {
          let val = parseInt(e.target.value, 10) - 1;
          if (val >= 0 && val < totalPages) setCurrentPage(val);
        }}
        style={{ width: "60px" }}
      />
      <button onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}>›</button>
    </div>
  );
}
