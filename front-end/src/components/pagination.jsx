import React, { useState, useEffect } from "react";

function Pagination({ page, maxPage, onPageChange }) {
  // Local state for what the user is typing
  const [inputValue, setInputValue] = useState(page);

  // Sync inputValue when page changes externally (via Prev/Next buttons)
  useEffect(() => {
    setInputValue(page);
  }, [page]);

  // Handles direct typing
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow empty input or numbers only
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setInputValue(value);
    }
  };

  // Handle Enter key to apply page change
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const targetPage = Math.min(
        Math.max(1, Number(inputValue) || 1),
        maxPage
      );
      onPageChange(targetPage, true); // true = force fetch
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* Prev */}
      <button
        className="btn bg-blue-500 join-item btn-outline"
        onClick={() => onPageChange(page - 1, true)}
        disabled={page <= 1}
      >
        &lt;
      </button>

      {/* Page input */}
      <div className="join text-gray-600">
        <input
          type="number"
          min="1"
          max={maxPage}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input input-bordered join-item w-16 text-center bg-[#ffffff] text-gray-600 border-1 border-black focus:outline-none"
        />
        <span className="btn join-item bg-gray-100 text-gray-600 cursor-default">
          of {maxPage}
        </span>
      </div>

      {/* Next */}
      <button
        className="btn btn-outline join-item bg-blue-500"
        onClick={() => onPageChange(page + 1, true)}
        disabled={page >= maxPage}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;
