"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  X,
  ChevronRight,
  Shirt,
  Laptop,
  Home,
  Book,
  Heart,
  ToyBrick,
  Car,
  Watch,
  Gamepad2,
  Music,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn-ui/popover";

type Brand = {
  brandId: string;
  categoryId: string;
  brand: {
    id: string;
    name: string;
  };
};

type Subcategory = {
  id: string;
  name: string;
  categoryId?: string;
};

type Category = {
  id: string;
  name: string;
  productSubcategory: Subcategory[];
  brands: Brand[];
};

const categoryIcons: { [key: string]: React.ElementType } = {
  "Men's Fashion": Shirt,
  "Women's Fashion": Shirt,
  Electronics: Laptop,
  "Home & Kitchen": Home,
  "Books & Media": Book,
  "Health & Beauty": Heart,
  "Toys & Games": ToyBrick,
  Automotive: Car,
  "Sports & Outdoors": Gamepad2,
  "Music & Instruments": Music,
  Default: Package,
};

const getCategoryIcon = (categoryName: string) => {
  const iconKey = Object.keys(categoryIcons).find((key) =>
    categoryName.toLowerCase().includes(key.toLowerCase())
  );
  return categoryIcons[iconKey || "Default"];
};

export default function CategoriesGrid({
  categories,
}: {
  categories: Category[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [popoverCategory, setPopoverCategory] = useState<Category | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase().trim();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{filteredCategories.length} categories</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-10 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all duration-200"
              aria-label="Search categories"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        {searchTerm && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Search className="h-4 w-4 text-pink-500" />
            <span>Search results for &ldquo;{searchTerm}&rdquo;</span>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCategories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            return (
              <div key={category.id} className="group">
                <Card className="h-full overflow-hidden border border-gray-200 hover:border-pink-300 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] bg-white cursor-pointer focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400">
                  <CardContent className="p-6">
                    {/* Category Icon/Image */}
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-100 group-hover:border-pink-200 transition-all duration-300 flex items-center justify-center shadow-sm group-hover:shadow-md bg-pink-50"
                        aria-hidden="true"
                      >
                        <Icon className="h-10 w-10 text-pink-500" />
                      </div>

                      {/* Category Info */}
                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 text-center leading-tight">
                          {category.name}
                        </h3>
                        <div className="flex items-center justify-center text-xs text-gray-500 space-x-2">
                          <span>
                            {category.productSubcategory?.length || 0}{" "}
                            subcategories
                          </span>
                          {(category.brands?.length || 0) > 0 && (
                            <>
                              <span>•</span>
                              <span>{category.brands.length} brands</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Show Details Button with Popover */}
                    <div className="flex justify-center mt-4">
                      <Popover open={popoverOpen && popoverCategory?.id === category.id} onOpenChange={(open) => {
                        setPopoverOpen(open);
                        if (open) {
                          setPopoverCategory(category);
                        } else {
                          setPopoverCategory(null);
                        }
                      }}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                          >
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Show Details
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-0" side="bottom" align="center">
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {category.name} Details
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPopoverOpen(false)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {/* Quick Access */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                  Quick Access
                                </h4>
                                <Link
                                  href={`/search?categoryId=${category.id}`}
                                  onClick={() => setPopoverOpen(false)}
                                  className="block"
                                >
                                  <div className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 p-3 text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h5 className="font-semibold text-sm">
                                          View All {category.name}
                                        </h5>
                                        <p className="text-pink-100 text-xs">
                                          Browse all products
                                        </p>
                                      </div>
                                      <ChevronRight className="h-4 w-4" />
                                    </div>
                                  </div>
                                </Link>
                              </div>

                              {/* Subcategories */}
                              {category.productSubcategory &&
                                category.productSubcategory.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                      Subcategories
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                                      {category.productSubcategory.map(
                                        (subcategory) => (
                                          <Link
                                            key={subcategory.id}
                                            href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
                                            onClick={() => setPopoverOpen(false)}
                                            className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 text-xs transition-all duration-200 hover:border-pink-300 hover:bg-pink-50"
                                          >
                                            <span className="font-medium text-gray-900">
                                              {subcategory.name}
                                            </span>
                                            <ChevronRight className="h-3 w-3 text-gray-400" />
                                          </Link>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Brands */}
                              {category.brands &&
                                category.brands.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                      Popular Brands
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                                      {category.brands
                                        .slice(0, 6)
                                        .map((brandItem) => (
                                          <Link
                                            key={brandItem.brand.id}
                                            href={`/search?categoryId=${category.id}&brandId=${brandItem.brand.id}`}
                                            onClick={() => setPopoverOpen(false)}
                                            className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-center transition-all duration-200 hover:border-pink-300 hover:bg-pink-50"
                                          >
                                            <span className="text-xs font-medium text-gray-900">
                                              {brandItem.brand.name}
                                            </span>
                                          </Link>
                                        ))}
                                    </div>
                                  </div>
                                )}

                              {/* Show message if no subcategories or brands */}
                              {(!category.productSubcategory ||
                                category.productSubcategory.length === 0) &&
                                (!category.brands ||
                                  category.brands.length === 0) && (
                                  <div className="text-center py-4">
                                    <p className="text-xs text-gray-500">
                                      No additional subcategories or brands available.
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      Browse all products using the button above.
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>


      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 mb-4">
            No categories match &ldquo;{searchTerm}&rdquo;. Try a different
            search term.
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchTerm("")}
            className="border-pink-200 hover:border-pink-400 hover:bg-pink-50"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}