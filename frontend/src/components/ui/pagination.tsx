"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaginationProps {
  // Pagination data
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;

  // Configuration
  pageSizeOptions: number[];
  loading?: boolean;
  itemsName?: string; // e.g., "条记录", "个分类", "篇文章"
}

export default function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  loading = false,
  itemsName = "条记录",
}: PaginationProps) {
  if (loading) {
    return null;
  }

  return (
    <>
      {/* Page Size Selector and Pagination */}
      {total > 0 && (
        <div className="flex justify-between items-center">
          {/* Page Size Selector - Left */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="pageSize" className="text-sm">
              每页显示:
            </Label>
            <Select
              value={limit.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} 条/页
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results info */}
          <div className="text-sm text-gray-500 text-center">
            {total > 0 ? (
              <>
                显示第 {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, total)} 条， 共 {total} {itemsName}
              </>
            ) : (
              "暂无数据"
            )}
          </div>

          {/* Pagination - Right */}
          <div className="flex items-center space-x-2">
            {/* Previous button */}
            <Button
              variant="outline"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              size="sm"
            >
              上一页
            </Button>

            {/* Page numbers with smart display */}
            {(() => {
              const currentPage = page;
              const maxVisiblePages = 5;

              if (totalPages <= maxVisiblePages) {
                // Show all pages if total is small
                return Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={
                        pageNumber === currentPage ? "default" : "outline"
                      }
                      onClick={() => onPageChange(pageNumber)}
                      size="sm"
                      className={
                        pageNumber === currentPage
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {pageNumber}
                    </Button>
                  )
                );
              } else {
                // Smart pagination for many pages
                const pages = [];

                // Always show first page
                if (currentPage > 3) {
                  pages.push(
                    <Button
                      key={1}
                      variant="outline"
                      onClick={() => onPageChange(1)}
                      size="sm"
                    >
                      1
                    </Button>
                  );
                  if (currentPage > 4) {
                    pages.push(
                      <span key="ellipsis1" className="px-2">
                        ...
                      </span>
                    );
                  }
                }

                // Show pages around current page
                const start = Math.max(1, currentPage - 1);
                const end = Math.min(totalPages, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={i === currentPage ? "default" : "outline"}
                      onClick={() => onPageChange(i)}
                      size="sm"
                      className={
                        i === currentPage
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {i}
                    </Button>
                  );
                }

                // Always show last page
                if (currentPage < totalPages - 2) {
                  if (currentPage < totalPages - 3) {
                    pages.push(
                      <span key="ellipsis2" className="px-2">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <Button
                      key={totalPages}
                      variant="outline"
                      onClick={() => onPageChange(totalPages)}
                      size="sm"
                    >
                      {totalPages}
                    </Button>
                  );
                }

                return pages;
              }
            })()}

            {/* Next button */}
            <Button
              variant="outline"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              size="sm"
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
