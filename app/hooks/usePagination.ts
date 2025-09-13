import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

export function usePagination<T>({ items, itemsPerPage }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      paginatedItems,
      totalItems: items.length
    };
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    ...paginationData,
    handlePageChange,
    resetToFirstPage
  };
}
