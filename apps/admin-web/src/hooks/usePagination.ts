import { useState, useMemo, useEffect } from "react";

export interface PaginationResult<T> {
  paginatedItems: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export function usePagination<T>(items: T[], defaultPageSize = 25): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Reset to page 1 when the items array length changes (e.g., filter/search applied)
  const totalItems = items.length;
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    paginatedItems,
    currentPage,
    pageSize,
    totalItems: items.length,
    setCurrentPage,
    setPageSize: handlePageSizeChange,
  };
}
