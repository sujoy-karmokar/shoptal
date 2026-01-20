"use client";

import { Skeleton } from "@/components/shadcn-ui/skeleton";

export const InputSkeleton = ({ label }: { label: string }) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
};

export const EditProductFormSkeleton = () => {
  return (
    <div className="w-2/3 space-y-6">
      <InputSkeleton label="Product Name" />
      <InputSkeleton label="Product Price" />
      <InputSkeleton label="Product Quantity" />
      <InputSkeleton label="Brand" />
      <InputSkeleton label="Category" />
      <InputSkeleton label="Subcategory" />
      <InputSkeleton label="Product Image" />
      <InputSkeleton label="Product Description" />

      {/* Image Preview Skeleton */}
      <Skeleton className="w-36 h-36 rounded-md" />

      {/* Features Section Skeleton */}
      <div className="space-y-4">
        <h2 className="font-semibold">Features:</h2>
        <div className="flex space-x-4 items-start">
          <div className="flex-1">
            <InputSkeleton label="Feature Name" />
          </div>
          <div className="flex-1">
            <InputSkeleton label="Feature Value" />
          </div>
          <Skeleton className="h-10 w-20 mt-8" /> {/* Delete button */}
        </div>
        <Skeleton className="h-10 w-32" /> {/* Add Feature button */}
      </div>

      {/* Submit Button Skeleton */}
      <Skeleton className="h-10 w-full max-w-[200px]" />
    </div>
  );
};
