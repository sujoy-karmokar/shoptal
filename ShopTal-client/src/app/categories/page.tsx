import { Metadata } from "next";
import CategoriesGrid from "@/components/categories-page-components/CategoriesGrid";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import Link from "next/link";
import { fetchCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "All Categories - ShopTal",
  description:
    "Browse all product categories at ShopTal. Find exactly what you're looking for with our comprehensive category collection.",
  keywords:
    "categories, product categories, shopping categories, ShopTal categories",
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon" className="shrink-0">
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  All Categories
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Explore categories with their subcategories and brands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <CategoriesGrid categories={categories} />
      </div>
    </div>
  );
}
