"use client";

import { useState } from "react";
import { Search, X, ChevronRight, Grid3X3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn-ui/sheet";

interface Brand {
  brandId: string;
  categoryId: string;
  brand: {
    id: string;
    name: string;
  };
}

interface ProductSubcategory {
  id: string;
  name: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  productSubcategory: ProductSubcategory[];
  brands: Brand[];
}

interface MobileCategoryBrowserProps {
  categories: Category[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function MobileCategoryBrowser({
  categories,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: MobileCategoryBrowserProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Use external control if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    setSearchTerm("");
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          // Reset state when closing
          setSelectedCategory(null);
          setSearchTerm("");
        }
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-w-[44px] min-h-[44px] p-3"
        >
          <Grid3X3 className="h-5 w-5 text-primary" />
          <span className="sr-only">Browse Categories</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-xl border-t border-pink-100 bg-white p-0"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="border-b border-pink-50 p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToCategories}
                    className="p-1 h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                )}
                <SheetTitle className="text-lg font-semibold text-gray-900">
                  {selectedCategory
                    ? selectedCategory.name
                    : "Browse Categories"}
                </SheetTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1 h-8 w-8"
              >
                {/* <X className="h-4 w-4" /> */}
              </Button>
            </div>
            <SheetDescription className="text-sm text-gray-600 mt-1">
              {selectedCategory
                ? "Choose a subcategory or brand"
                : "Find products by category"}
            </SheetDescription>
          </SheetHeader>

          {/* Search Bar */}
          {!selectedCategory && (
            <div className="p-4 border-b border-pink-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base rounded-lg border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {!selectedCategory ? (
              /* Categories Grid */
              <div className="grid grid-cols-2 gap-3">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-white p-4 text-left shadow-sm ring-1 ring-pink-100 transition-all duration-200 hover:shadow-md hover:ring-pink-200 active:scale-95"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-200">
                        <span className="text-lg font-bold">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-pink-700 transition-colors line-clamp-2 text-center">
                        {category.name}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>
                          {category.productSubcategory.length} subcategories
                        </span>
                        {category.brands.length > 0 && (
                          <span className="ml-1">
                            • {category.brands.length} brands
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-pink-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            ) : (
              /* Category Details */
              <div className="space-y-6">
                {/* Quick Access - View All */}
                <Link
                  href={`/search?categoryId=${selectedCategory.id}`}
                  onClick={handleClose}
                  className="block"
                >
                  <div className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 p-4 text-white shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          View All {selectedCategory.name}
                        </h3>
                        <p className="text-pink-100 text-sm">
                          Browse all products in this category
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>

                {/* Subcategories */}
                {selectedCategory.productSubcategory.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                      Subcategories
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedCategory.productSubcategory.map(
                        (subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/search?categoryId=${selectedCategory.id}&subcategoryId=${subcategory.id}`}
                            onClick={handleClose}
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-pink-300 hover:bg-pink-50 active:scale-95"
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {subcategory.name}
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Brands */}
                {selectedCategory.brands.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                      Popular Brands
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCategory.brands.slice(0, 6).map((brandItem) => (
                        <Link
                          key={brandItem.brand.id}
                          href={`/search?categoryId=${selectedCategory.id}&brandId=${brandItem.brand.id}`}
                          onClick={handleClose}
                          className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-3 text-center transition-all duration-200 hover:border-pink-300 hover:bg-pink-50 active:scale-95"
                        >
                          <span className="text-xs font-medium text-gray-900">
                            {brandItem.brand.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
