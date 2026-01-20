"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useClickOutside from "@/hooks/useClickOutside";
import Image from "next/image";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface SearchResultProps {
  product: Product;
  onSelect: () => void;
}

interface SearchResultsListProps {
  results: Product[];
  onSelect: () => void;
}

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SEARCH_DELAY = 400;
const MIN_SEARCH_LENGTH = 2;

// Custom debounce hook
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup on unmount or when callback/delay changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

// Individual Search Result Component
const SearchResult = ({ product, onSelect }: SearchResultProps) => (
  <Link
    href={`/product/${product.id}`}
    className="flex items-center gap-3 p-2 hover:bg-pink-50 rounded transition-colors"
    onClick={onSelect}
  >
    {product.image ? (
      <Image
        src={product.image}
        alt={product.name}
        width={40}
        height={40}
        className="w-10 h-10 rounded object-cover"
      />
    ) : (
      <div
        className="w-10 h-10 rounded flex items-center justify-center text-white text-base font-bold"
        style={{ background: stringToColor(product.name) }}
      >
        {product.name.charAt(0).toUpperCase()}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium truncate">{product.name}</p>
      <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
    </div>
  </Link>
);

// Utility to generate a color from a string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

// Search Results List Component
const SearchResultsList = ({ results, onSelect }: SearchResultsListProps) => (
  <div className="grid gap-2 p-2">
    {results.map((product) => (
      <SearchResult key={product.id} product={product} onSelect={onSelect} />
    ))}
  </div>
);

// Search Component
export default function SearchProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside of the search container
  useClickOutside(searchContainerRef as React.RefObject<HTMLElement>, () => {
    setShowDropdown(false);
  });

  const debouncedSearch = useDebounce(async (term: string) => {
    if (term?.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/products?searchTerm=${term}`
      );
      const data = await response.json();
      setSearchResults(data?.data?.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, SEARCH_DELAY);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Close dropdown on Escape
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter") {
      router.push(`/search?searchTerm=${searchTerm}`);
    }
  };

  const handleFocus = () => {
    if (searchTerm.length >= MIN_SEARCH_LENGTH && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <div ref={searchContainerRef} className="relative">
      <div className="relative">
        <Link
          type="button"
          href={`/search?searchTerm=${searchTerm}`}
          className="absolute left-2 top-2 h-4 w-4 text-primary focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
          tabIndex={0}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Link>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-8 pr-2 py-2 rounded border border-pink-200 placeholder:text-primary focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm bg-white placeholder:opacity-50"
          aria-label="Search products"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          role="combobox"
        />
      </div>
      {showDropdown && (
        <div
          id="search-results"
          className="absolute z-50 w-full mt-1 bg-white rounded shadow border border-pink-100 max-h-72 overflow-y-auto animate-fade-in-up"
          role="listbox"
        >
          {isLoading ? (
            <div
              className="p-3 text-center text-gray-400 flex items-center justify-center gap-2 text-xs"
              role="status"
              aria-live="polite"
            >
              <svg
                className="animate-spin h-4 w-4 text-pink-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : searchResults.length > 0 ? (
            <SearchResultsList
              results={searchResults}
              onSelect={closeDropdown}
            />
          ) : (
            <div
              className="p-3 text-center text-gray-400 text-xs"
              role="status"
              aria-live="polite"
            >
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
