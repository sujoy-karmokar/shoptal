"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn-ui/sheet";

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  totalResults?: number;
  children?: React.ReactNode; // For filters
}

export default function SearchHeader({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  totalResults,
  children
}: SearchHeaderProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-pink-100">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit(e)}
                className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
              />
            </div>
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-200">
                  <Filter className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-xl font-semibold">Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  {children}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results count */}
          {totalResults !== undefined && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {totalResults === 0
                  ? "No results found"
                  : `${totalResults} product${totalResults === 1 ? '' : 's'} found`
                }
              </p>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange("")}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit(e)}
                  className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
                />
              </div>
            </div>

            {totalResults !== undefined && (
              <div className="flex items-center gap-4 ml-6">
                <p className="text-sm text-gray-600">
                  {totalResults === 0
                    ? "No results found"
                    : `${totalResults} product${totalResults === 1 ? '' : 's'} found`
                  }
                </p>
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSearchChange("")}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}