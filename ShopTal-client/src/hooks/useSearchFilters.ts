'use client';

import { useState, useEffect } from 'react';
import { SearchParams } from '@/types';

const MAX_PRICE = 5000;

export function useSearchFilters(
  currentFilters: SearchParams,
  onFiltersChange?: (filters: Partial<SearchParams>) => void
) {
  const [draftFilters, setDraftFilters] = useState(currentFilters);

  useEffect(() => {
    setDraftFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (
    type: 'categoryId' | 'subcategoryId' | 'brandId',
    value: string,
    parentCategoryId?: string
  ) => {
    setDraftFilters((prev) => {
      const newFilters = { ...prev };
      const currentValue = newFilters[type];
      const newValue = currentValue === value ? undefined : value;
      newFilters[type] = newValue;

      if (newValue) {
        if (type === 'subcategoryId' || type === 'brandId') {
          newFilters.categoryId = parentCategoryId;
          if (type === 'subcategoryId') newFilters.brandId = undefined;
          if (type === 'brandId') newFilters.subcategoryId = undefined;
        }
      } else {
        if (type === 'categoryId') {
          newFilters.subcategoryId = undefined;
          newFilters.brandId = undefined;
        }
      }

      return newFilters;
    });
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setDraftFilters((prev) => ({
      ...prev,
      minPrice: newRange[0],
      maxPrice: newRange[1],
    }));
  };

  const handlePriceInputChange = (index: 0 | 1, value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const newRange = [
      draftFilters.minPrice || 0,
      draftFilters.maxPrice || MAX_PRICE,
    ] as [number, number];
    newRange[index] = Math.min(Math.max(numValue, 0), MAX_PRICE);

    if (index === 0 && newRange[0] > newRange[1]) newRange[0] = newRange[1];
    if (index === 1 && newRange[1] < newRange[0]) newRange[1] = newRange[0];

    handlePriceRangeChange(newRange);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onFiltersChange?.(draftFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      minPrice: 0,
      maxPrice: MAX_PRICE,
    };
    setDraftFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters =
    draftFilters.categoryId ||
    draftFilters.subcategoryId ||
    draftFilters.brandId ||
    draftFilters.minPrice ||
    (draftFilters.maxPrice && draftFilters.maxPrice < MAX_PRICE);

  return {
    draftFilters,
    handleFilterChange,
    handlePriceRangeChange,
    handlePriceInputChange,
    handleSubmit,
    handleClearFilters,
    hasActiveFilters,
    MAX_PRICE,
  };
}
