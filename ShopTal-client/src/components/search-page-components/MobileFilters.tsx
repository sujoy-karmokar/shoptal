"use client";

import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Input } from "@/components/shadcn-ui/input";
import { Slider } from "@/components/shadcn-ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn-ui/accordion";
import { Category, SearchParams } from "@/types";
import { useSearchFilters } from "@/hooks/useSearchFilters";

interface Subcategory {
  id: string;
  name: string;
  categoryId?: string;
}

interface Brand {
  id: string;
  categoryId?: string;
  brand: {
    id: string;
    name: string;
  };
}

interface CategoryForFilter
  extends Omit<Category, "productSubcategory" | "brands"> {
  productSubcategory: Subcategory[];
  brands: Brand[];
}

interface MobileFiltersProps {
  categories: CategoryForFilter[];
  currentFilters: SearchParams;
  onApplyFilters: (filters: Partial<SearchParams>) => void;
  onClose: () => void;
}

export default function MobileFilters({
  categories,
  currentFilters,
  onApplyFilters,
  onClose,
}: MobileFiltersProps) {
  const {
    draftFilters,
    handleFilterChange,
    handlePriceRangeChange,
    handlePriceInputChange,
    handleClearFilters,
    hasActiveFilters,
    MAX_PRICE,
  } = useSearchFilters(currentFilters, onApplyFilters);

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              Categories
            </label>
            <div className="pr-2">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {categories?.map((cat) => (
                  <AccordionItem
                    value={cat.id}
                    key={cat.id}
                    className="border-b-0"
                  >
                    <div className="flex items-center space-x-3 py-1">
                      <Checkbox
                        id={`mobile-category-${cat.id}`}
                        checked={draftFilters.categoryId === cat.id}
                        onCheckedChange={() =>
                          handleFilterChange("categoryId", cat.id)
                        }
                        className="h-5 w-5 border-gray-300 dark:border-gray-700"
                      />
                      <AccordionTrigger className="hover:no-underline py-0 flex-1">
                        <label
                          htmlFor={`mobile-category-${cat.id}`}
                          className="text-sm text-gray-700 dark:text-gray-200 font-medium cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {cat.name}
                        </label>
                      </AccordionTrigger>
                    </div>

                    <AccordionContent className="pt-2">
                      <div className="space-y-4">
                        {cat.productSubcategory?.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide pl-2">
                              Subcategories
                            </div>
                            <div className="space-y-2">
                              {cat.productSubcategory.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="flex items-center space-x-3 pl-2"
                                >
                                  <Checkbox
                                    id={`mobile-subcategory-${sub.id}`}
                                    checked={draftFilters.subcategoryId === sub.id}
                                    onCheckedChange={() =>
                                      handleFilterChange(
                                        "subcategoryId",
                                        sub.id,
                                        cat.id
                                      )
                                    }
                                    className="h-5 w-5 border-gray-300 dark:border-gray-700"
                                  />
                                  <label
                                    htmlFor={`mobile-subcategory-${sub.id}`}
                                    className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer flex-1"
                                  >
                                    {sub.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {cat.brands?.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide pl-2">
                              Brands
                            </div>
                            <div className="space-y-2">
                              {cat.brands.map((brand) => (
                                <div
                                  key={brand.brand.id}
                                  className="flex items-center space-x-3 pl-2"
                                >
                                  <Checkbox
                                    id={`mobile-brand-${brand.brand.id}`}
                                    checked={draftFilters.brandId === brand.brand.id}
                                    onCheckedChange={() =>
                                      handleFilterChange(
                                        "brandId",
                                        brand.brand.id,
                                        cat.id
                                      )
                                    }
                                    className="h-5 w-5 border-gray-300 dark:border-gray-700"
                                  />
                                  <label
                                    htmlFor={`mobile-brand-${brand.brand.id}`}
                                    className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer flex-1"
                                  >
                                    {brand.brand.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
              Price Range
            </label>
            <Slider
              value={[
                draftFilters.minPrice || 0,
                draftFilters.maxPrice || MAX_PRICE,
              ]}
              onValueChange={(value) =>
                handlePriceRangeChange(value as [number, number])
              }
              max={MAX_PRICE}
              step={10}
              className="my-4"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  type="number"
                  placeholder="Min"
                  value={draftFilters.minPrice || ""}
                  onChange={(e) => handlePriceInputChange(0, e.target.value)}
                  className="w-full h-10 text-base rounded-lg border-gray-200 dark:border-gray-700"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max"
                  value={draftFilters.maxPrice || ""}
                  onChange={(e) => handlePriceInputChange(1, e.target.value)}
                  className="w-full h-10 text-base rounded-lg border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-none p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex gap-3">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1 h-12 rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Clear All
            </Button>
          )}
          <Button
            onClick={handleApply}
            className="flex-1 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
