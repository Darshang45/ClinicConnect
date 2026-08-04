import React from "react";

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalRecords, hasNextPage, hasPreviousPage } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="admin-pagination">
      <div className="pagination-text">
        Showing page <strong className="text-dark">{currentPage}</strong> of{" "}
        <strong className="text-dark">{totalPages}</strong>
        {totalRecords !== undefined && (
          <span className="ms-1">({totalRecords} total records)</span>
        )}
      </div>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            type="button"
            className={`pagination-btn ${num === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          className="pagination-btn"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
