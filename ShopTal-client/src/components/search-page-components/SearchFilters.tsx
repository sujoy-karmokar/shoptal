"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Input } from "@/components/shadcn-ui/input";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Button } from "@/components/shadcn-ui/button";
import { Slider } from "@/components/shadcn-ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn-ui/accordion";
import { ScrollArea } from "@/components/shadcn-ui/scroll-area";
import { Category, SearchParams } from "@/types";
import { useSearchFilters } from "@/hooks/useSearchFilters";

// --- TYPES --- //
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

interface SearchFiltersProps {
  categories: CategoryForFilter[];
  currentFilters: SearchParams;
  onFiltersChange?: (filters: Partial<SearchParams>) => void;
}

// --- SUB-COMPONENTS --- //
const FilterCheckbox = ({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="h-5 w-5 border-gray-300 dark:border-gray-700 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
    />
    <label
      htmlFor={id}
      className="text-sm text-gray-700 dark:text-gray-200 font-medium cursor-pointer flex-1"
    >
      {label}
    </label>
  </div>
);

// --- MAIN COMPONENT --- //
export function SearchFilters({
  categories,
  currentFilters,
  onFiltersChange,
}: SearchFiltersProps) {
  const {
    draftFilters,
    handleFilterChange,
    handlePriceRangeChange,
    handlePriceInputChange,
    handleSubmit,
    handleClearFilters,
    hasActiveFilters,
    MAX_PRICE,
  } = useSearchFilters(currentFilters, onFiltersChange);

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-none rounded-xl p-4 md:p-4 bg-white dark:bg-gray-950">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Categories Section */}
          <div className="space-y-1">
            <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wide">
              Categories
            </h3>
            <ScrollArea className="h-72">
              <Accordion type="single" collapsible className="w-full">
                {categories?.map((cat) => (
                  <AccordionItem value={cat.id} key={cat.id}>
                    <AccordionTrigger>{cat.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <FilterCheckbox
                          id={`category-${cat.id}`}
                          label={`All in ${cat.name}`}
                          checked={draftFilters.categoryId === cat.id}
                          onCheckedChange={() =>
                            handleFilterChange("categoryId", cat.id)
                          }
                        />

                        {cat.productSubcategory?.length > 0 && (
                          <div className="ml-4 space-y-2 pt-2">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Subcategories
                            </h4>
                            {cat.productSubcategory.map((sub) => (
                              <FilterCheckbox
                                key={sub.id}
                                id={`subcategory-${sub.id}`}
                                label={sub.name}
                                checked={draftFilters.subcategoryId === sub.id}
                                onCheckedChange={() =>
                                  handleFilterChange(
                                    "subcategoryId",
                                    sub.id,
                                    cat.id
                                  )
                                }
                              />
                            ))}
                          </div>
                        )}

                        {cat.brands?.length > 0 && (
                          <div className="ml-4 space-y-2 pt-2">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Brands
                            </h4>
                            {cat.brands.map((brand) => (
                              <FilterCheckbox
                                key={brand.brand.id}
                                id={`brand-${brand.brand.id}`}
                                label={brand.brand.name}
                                checked={draftFilters.brandId === brand.brand.id}
                                onCheckedChange={() =>
                                  handleFilterChange(
                                    "brandId",
                                    brand.brand.id,
                                    cat.id
                                  )
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>

          {/* Price Range Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wide">
              Price Range
            </h3>
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
            <div className="flex items-center space-x-3">
              <Input
                type="number"
                placeholder="Min"
                value={draftFilters.minPrice || ""}
                onChange={(e) => handlePriceInputChange(0, e.target.value)}
                className="flex-1 h-10 text-base rounded-lg border"
              />
              <span className="text-sm text-gray-500 font-medium">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={draftFilters.maxPrice || ""}
                onChange={(e) => handlePriceInputChange(1, e.target.value)}
                className="flex-1 h-10 text-base rounded-lg border"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
            >
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className="w-full h-10 text-sm"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
