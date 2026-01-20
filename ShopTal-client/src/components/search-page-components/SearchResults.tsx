"use client";

import { useEffect, useState } from "react";
import { searchProducts } from "@/lib/api";
import { SearchParams } from "@/types";
import { ProductCard } from "@/components/search-page-components/ProductCard";
import { Pagination } from "@/components/search-page-components/Pagination";

interface SearchResultsProps {
  searchParams: SearchParams;
}

export default function SearchResults({ searchParams }: SearchResultsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchProducts(searchParams)
      .then((data) => {
        setProducts(data.data.data);
        setMeta(data.data.meta);
      })
      .catch(() => {
        setError("Failed to load products.");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-4 animate-fadein">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="border border-gray-100 rounded-xl p-4 bg-white animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-6 bg-pink-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 animate-fadein">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {error}
        </h2>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 animate-fadein">
        <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          No products found
        </h2>
        <p className="text-gray-500 text-base mb-6 max-w-md mx-auto">
          We couldn&apos;t find any products matching your search. Try adjusting your filters or search terms.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.href = '/search'}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 font-medium"
          >
            Clear Filters
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Browse All Products
          </button>
        </div>
      </div>
    );
  }

  const currentPage = meta?.page || 1;
  const limit = meta?.limit || 10;
  const totalPages = meta ? Math.ceil(meta.total / limit) : 1;

  return (
    <div className="space-y-4 animate-fadein">
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={searchParams}
        pageLimit={limit}
      />
      <style jsx global>{`
        .animate-fadein {
          animation: fadein 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
