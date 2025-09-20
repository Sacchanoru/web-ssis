import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4">
      <div className="join">
        {pages.map((page) => (
          <input
            key={page}
            type="radio"
            name="options"
            aria-label={page}
            className={`join-item btn btn-square border border-gray-300 text-blue-300 bg-white 
              ${currentPage === page ? "checked:bg-blue-300 checked:text-white" : ""}`}
            checked={currentPage === page}
            onChange={() => onPageChange(page)}
          />
        ))}
      </div>
    </div>
  );
}

export default Pagination;