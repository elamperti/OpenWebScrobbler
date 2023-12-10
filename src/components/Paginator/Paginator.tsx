import type { SyntheticEvent } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const MAX_PAGE_ITEMS = 7; // ToDo: make it dynamic by viewport and/or currentPage digits' count

type PaginatorProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export default function Paginator({ currentPage, pageCount, onPageChange }: PaginatorProps) {
  const minBound = Math.max(currentPage - Math.floor(MAX_PAGE_ITEMS / 2), 1);
  const maxBound = Math.min(minBound + MAX_PAGE_ITEMS, pageCount);

  const goToPage = (e: SyntheticEvent<HTMLElement>) => {
    const targetPage = e.currentTarget.dataset.page as string;
    onPageChange(parseInt(targetPage, 10));
  };

  const pageItems = Array(maxBound - minBound + 1)
    .fill(0)
    .map((_, i) => minBound + i);

  return (
    <Pagination className="mt-3 d-flex justify-content-center">
      {currentPage > Math.ceil(MAX_PAGE_ITEMS / 2) && (
        <PaginationItem>
          <PaginationLink first onClick={goToPage} data-page={1} />
        </PaginationItem>
      )}

      {pageItems.map((page) => (
        <PaginationItem key={page} active={page === currentPage}>
          <PaginationLink onClick={goToPage} data-page={page}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}

      {maxBound < pageCount && (
        <PaginationItem>
          <PaginationLink last onClick={goToPage} data-page={pageCount} />
        </PaginationItem>
      )}
    </Pagination>
  );
}
