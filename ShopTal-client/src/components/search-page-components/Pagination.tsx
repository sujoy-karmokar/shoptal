"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { SearchParams } from "@/types";
import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: SearchParams;
  pageLimit: number;
}

export function Pagination({
  currentPage,
  totalPages,
  searchParams,
  pageLimit,
}: PaginationProps) {
  const router = useRouter();
  const generatePageUrl = (page: number) => {
    const params = new URLSearchParams({
      ...(searchParams.searchTerm && { searchTerm: searchParams.searchTerm }),
      ...(searchParams.category && { category: searchParams.category }),
      ...(searchParams.minPrice && {
        minPrice: searchParams.minPrice.toString(),
      }),
      ...(searchParams.maxPrice && {
        maxPrice: searchParams.maxPrice.toString(),
      }),
      ...(searchParams.categoryId && { categoryId: searchParams.categoryId }),
      ...(searchParams.subcategoryId && {
        subcategoryId: searchParams.subcategoryId,
      }),
      ...(searchParams.brandId && { brandId: searchParams.brandId }),
      ...(searchParams.limit && { limit: searchParams.limit.toString() }),
      page: page.toString(),
    });
    return `/search?${params.toString()}`;
  };

  const generatePageLimitUrl = (limit: number) => {
    const params = new URLSearchParams({
      ...(searchParams.searchTerm && { searchTerm: searchParams.searchTerm }),
      ...(searchParams.category && { category: searchParams.category }),
      ...(searchParams.minPrice && {
        minPrice: searchParams.minPrice.toString(),
      }),
      ...(searchParams.maxPrice && {
        maxPrice: searchParams.maxPrice.toString(),
      }),
      ...(searchParams.categoryId && { categoryId: searchParams.categoryId }),
      ...(searchParams.subcategoryId && {
        subcategoryId: searchParams.subcategoryId,
      }),
      ...(searchParams.brandId && { brandId: searchParams.brandId }),
      ...(searchParams.page && { page: searchParams.page.toString() }),
      limit: limit.toString(),
    });
    return `/search?${params.toString()}`;
  };

  return (
    <div className="flex justify-center gap-1 flex-wrap mt-2">
      {currentPage > 1 && (
        <Button
          variant="outline"
          asChild
          className="rounded-full px-3 py-1 text-xs border border-gray-200 dark:border-gray-800"
        >
          <Link href={generatePageUrl(currentPage - 1)}>Previous</Link>
        </Button>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? "default" : "outline"}
          asChild
          className={`rounded-full px-3 py-1 text-xs border ${
            pageNum === currentPage
              ? "border-pink-400 bg-pink-50 text-pink-600"
              : "border-gray-200 dark:border-gray-800"
          }`}
        >
          <Link href={generatePageUrl(pageNum)}>{pageNum}</Link>
        </Button>
      ))}
      {currentPage < totalPages && (
        <Button
          variant="outline"
          asChild
          className="rounded-full px-3 py-1 text-xs border border-gray-200 dark:border-gray-800"
        >
          <Link href={generatePageUrl(currentPage + 1)}>Next</Link>
        </Button>
      )}
      <select
        id="quantity"
        value={pageLimit}
        onChange={(e) => {
          e.preventDefault();
          const newLimit = Number(e.target.value);
          router.push(generatePageLimitUrl(newLimit));
        }}
        className="rounded-full border border-gray-200 dark:border-gray-800 px-2 py-1 text-xs ml-2 bg-white dark:bg-gray-950"
      >
        {[5, 10, 20, 30, 40, 50].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
}
