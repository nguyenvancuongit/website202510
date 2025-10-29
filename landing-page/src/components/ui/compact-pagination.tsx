import React from "react"

import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"

export default function CompactPagination({
  currentPage,
  onPageChange,
  totalPages,
}: {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}) {
  const pagesSet = new Set<number>()
  if (totalPages >= 1) {pagesSet.add(1)}
  if (totalPages >= 2) {pagesSet.add(2)}
  if (currentPage - 1 > 2) {pagesSet.add(currentPage - 1)}
  if (currentPage >= 1 && currentPage <= totalPages) {pagesSet.add(currentPage)}
  if (currentPage + 1 < totalPages - 1) {pagesSet.add(currentPage + 1)}
  if (totalPages - 1 > 2) {pagesSet.add(totalPages - 1)}
  if (totalPages > 2) {pagesSet.add(totalPages)}

  const pages = Array.from(pagesSet)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  return (
    <UIPagination>
      <PaginationContent>
        {pages.map((page, idx) => {
          const prev = pages[idx - 1]
          const showEllipsis = idx > 0 && prev !== undefined && page - prev > 1
          return (
            <React.Fragment key={`group-${page}`}>
              {showEllipsis && (
                <PaginationItem key={`e-${prev}-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem key={page}>
                <PaginationLink
                  href={"#"}
                  onClick={(e) => {
                    e.preventDefault()
                    if (page !== currentPage) {onPageChange(page)}
                  }}
                  isActive={page === currentPage}
                  className={
                    page === currentPage
                      ? "rounded border border-vibrant-blue text-vibrant-blue"
                      : "rounded border border-medium-dark-blue-grey text-medium-dark-blue-grey hover:border-vibrant-blue hover:text-vibrant-blue"
                  }
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          )
        })}
      </PaginationContent>
    </UIPagination>
  )
}
