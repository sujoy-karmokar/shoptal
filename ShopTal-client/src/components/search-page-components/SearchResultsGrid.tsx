"use client";

import { ProductCard } from "./ProductCard";
import { Product } from "@/types";

interface SearchResultsGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function SearchResultsGrid({ products, isLoading }: SearchResultsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="border border-gray-100 rounded-xl p-4 bg-white animate-pulse">
            <div className="w-full h-32 sm:h-36 md:h-40 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-pink-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 animate-fadein">
        <div className="mx-auto w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No products found
        </h2>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Try adjusting your search terms or filters to find what you&apos;re looking for.
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 animate-fadein">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}