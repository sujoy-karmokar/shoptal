import { getCategories, searchProducts } from "@/lib/api";
import { SearchParams } from "@/types";
import SearchPageClient from "@/components/search-page-components/SearchPageClient";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;

  const parsedParams: SearchParams = {
    searchTerm: resolvedParams.searchTerm?.toString(),
    category: resolvedParams.category?.toString(),
    minPrice: resolvedParams.minPrice
      ? Number(resolvedParams.minPrice)
      : undefined,
    maxPrice: resolvedParams.maxPrice
      ? Number(resolvedParams.maxPrice)
      : undefined,
    page: resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit: resolvedParams.limit ? Number(resolvedParams.limit) : 12,
    categoryId: resolvedParams.categoryId?.toString(),
    subcategoryId: resolvedParams.subcategoryId?.toString(),
    brandId: resolvedParams.brandId?.toString(),
  };

  const [categoriesData, productsData] = await Promise.all([
    getCategories({ limit: 20 }),
    searchProducts(parsedParams),
  ]);

  const categories = categoriesData.data.data;
  const initialProducts = productsData.data.data;
  const meta = productsData.data.meta;

  const initialTotalResults = meta?.total || 0;
  const initialTotalPages = Math.ceil(
    (meta?.total || 0) / (parsedParams.limit || 12)
  );

  return (
    <SearchPageClient
      initialSearchParams={parsedParams}
      categories={categories}
      initialProducts={initialProducts}
      initialTotalResults={initialTotalResults}
      initialTotalPages={initialTotalPages}
    />
  );
}
