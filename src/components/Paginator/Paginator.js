import React from 'react';
import PropTypes from 'prop-types';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const MAX_PAGE_ITEMS = 7; // ToDo: make it dynamic by viewport and/or currentPage digits' count

export default function Paginator({ currentPage, pageCount, onPageChange }) {
  const minBound = Math.max(currentPage - Math.floor(MAX_PAGE_ITEMS / 2), 1);
  const maxBound = Math.min(minBound + MAX_PAGE_ITEMS, pageCount);

  const goToPage = (e) => {
    const targetPage = e.currentTarget.dataset.page;
    onPageChange(parseInt(targetPage));
  };

  const pageItems = Array(maxBound - minBound)
    .fill()
    .map((_, i) => minBound + i);

  return (
    <Pagination className="mt-3 d-flex justify-content-center">
      {currentPage > Math.ceil(MAX_PAGE_ITEMS / 2) && (
        <PaginationItem>
          <PaginationLink first onClick={goToPage} data-page={1} />
        </PaginationItem>
      )}
      {currentPage > 1 && (
        <PaginationItem>
          <PaginationLink previous onClick={goToPage} data-page={currentPage - 1} />
        </PaginationItem>
      )}

      {pageItems.map((page) => (
        <PaginationItem key={page} active={page === currentPage}>
          <PaginationLink onClick={goToPage} data-page={page}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}

      {currentPage < pageCount && (
        <PaginationItem>
          <PaginationLink next onClick={goToPage} data-page={currentPage + 1} />
        </PaginationItem>
      )}
      {maxBound < pageCount && (
        <PaginationItem>
          <PaginationLink last onClick={goToPage} data-page={pageCount} />
        </PaginationItem>
      )}
    </Pagination>
  );
}

Paginator.propTypes = {
  currentPage: PropTypes.number,
  pageCount: PropTypes.number,
  onPageChange: PropTypes.func,
};
