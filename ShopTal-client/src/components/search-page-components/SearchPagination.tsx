"use client";

import React from "react";
import { Button } from "@/components/shadcn-ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageLimit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

export default function SearchPagination({
  currentPage,
  totalPages,
  totalResults,
  pageLimit,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: SearchPaginationProps) {
  // Don't show pagination if there's only one page or no results
  // if (totalPages <= 1 || totalResults === 0) {
  //   return null;
  // }

  // Calculate the range of items being shown
  const startItem = (currentPage - 1) * pageLimit + 1;
  const endItem = Math.min(currentPage * pageLimit, totalResults);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4 bg-white border-t border-gray-100 mt-4">
      {/* Results info */}
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Showing <span className="font-medium text-gray-900">{startItem}</span>{" "}
        to <span className="font-medium text-gray-900">{endItem}</span> of{" "}
        <span className="font-medium text-gray-900">{totalResults}</span>{" "}
        results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* Items per page selector */}
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={pageLimit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={isLoading}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-pink-200 focus:border-pink-300 disabled:opacity-50"
          >
            {[6, 12, 24, 36, 48].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || isLoading}
            className="h-9 w-9 p-0 border-gray-200 hover:bg-pink-50 hover:border-pink-300 disabled:opacity-50"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="h-9 w-9 p-0 border-gray-200 hover:bg-pink-50 hover:border-pink-300 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 py-1 text-gray-400">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  disabled={isLoading}
                  className={`h-9 w-9 p-0 ${
                    page === currentPage
                      ? "bg-pink-600 hover:bg-pink-700 text-white border-pink-600"
                      : "border-gray-200 hover:bg-pink-50 hover:border-pink-300 disabled:opacity-50"
                  }`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="h-9 w-9 p-0 border-gray-200 hover:bg-pink-50 hover:border-pink-300 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
            className="h-9 w-9 p-0 border-gray-200 hover:bg-pink-50 hover:border-pink-300 disabled:opacity-50"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
