"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchParams } from "@/types";
import SearchHeader from "./SearchHeader";
import SearchResultsGrid from "./SearchResultsGrid";
import { SearchFilters } from "./SearchFilters";
import MobileFilters from "./MobileFilters";
import SearchPagination from "./SearchPagination";
import { searchProducts } from "@/lib/api";
import { Product } from "@/types";

interface SearchPageClientProps {
  initialSearchParams: SearchParams;
  categories: any[];
  initialProducts: Product[];
  initialTotalResults: number;
  initialTotalPages: number;
}

export default function SearchPageClient({
  initialSearchParams,
  categories,
  initialProducts,
  initialTotalResults,
  initialTotalPages,
}: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    initialSearchParams.searchTerm || ""
  );
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] =
    useState<Partial<SearchParams>>(initialSearchParams);
  const [totalResults, setTotalResults] = useState(initialTotalResults);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  // Load products based on current filters
  const loadProducts = useCallback(async (filters: Partial<SearchParams>) => {
    setIsLoading(true);
    try {
      const result = await searchProducts({
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 12,
      });
      setProducts(result.data.data);
      setTotalResults(result.data.meta?.total || 0);
      setTotalPages(
        Math.ceil((result.data.meta?.total || 0) / (filters.limit || 12))
      );
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update URL when filters change
  const updateURL = useCallback(
    (filters: Partial<SearchParams>) => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, value.toString());
        }
      });

      const newURL = `/search${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      router.replace(newURL, { scroll: false });
    },
    [router]
  );

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...currentFilters, searchTerm, page: 1 };
    setCurrentFilters(newFilters);
    updateURL(newFilters);
    loadProducts(newFilters);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<SearchParams>) => {
    const updatedFilters = { ...currentFilters, ...newFilters, page: 1 };
    setCurrentFilters(updatedFilters);
    updateURL(updatedFilters);
    loadProducts(updatedFilters);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    const updatedFilters = { ...currentFilters, page };
    setCurrentFilters(updatedFilters);
    updateURL(updatedFilters);
    loadProducts(updatedFilters);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle limit changes
  const handleLimitChange = (limit: number) => {
    const updatedFilters = { ...currentFilters, limit, page: 1 };
    setCurrentFilters(updatedFilters);
    updateURL(updatedFilters);
    loadProducts(updatedFilters);
  };

  // Update filters when URL changes
  useEffect(() => {
    const urlFilters: Partial<SearchParams> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === "page" || key === "limit") {
        (urlFilters as any)[key] = Number(value);
      } else if (key === "minPrice" || key === "maxPrice") {
        (urlFilters as any)[key] = value ? Number(value) : undefined;
      } else {
        (urlFilters as any)[key] = value;
      }
    }
    setCurrentFilters(urlFilters);
    setSearchTerm(urlFilters.searchTerm || "");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <SearchHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        totalResults={totalResults}
      >
        <MobileFilters
          categories={categories}
          currentFilters={currentFilters}
          onApplyFilters={handleFiltersChange}
          onClose={() => {}} // Sheet handles closing
        />
      </SearchHeader>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-24">
              <SearchFilters
                categories={categories}
                currentFilters={currentFilters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <SearchResultsGrid products={products} isLoading={isLoading} />

            {/* Pagination */}
            <SearchPagination
              currentPage={currentFilters.page || 1}
              totalPages={totalPages}
              totalResults={totalResults}
              pageLimit={currentFilters.limit || 12}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
