import React from "react";
import Button from "./Button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <Button className="h-6 w-6" onClick={() => onPageChange(currentPage - 1)}>
        «
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const showPage =
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1);

        const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
        const showEllipsisAfter =
          page === currentPage + 2 && currentPage < totalPages - 2;

        if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
          return null;
        }

        if (showEllipsisBefore || showEllipsisAfter) {
          return <span className="px-2 text-gray-400">...</span>;
        }
        return (
          <Button variant={page === currentPage ? "solid" : "outline"} className={`h-8 w-8 `} onClick={() => onPageChange(page)}>
            {page}
          </Button>
        );
      })}

      <Button className="h-6 w-6" onClick={() => onPageChange(currentPage + 1)}>
        »
      </Button>
    </div>
  );
}
