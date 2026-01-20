"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ChevronDown } from "lucide-react";

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

export default function NavbarMenu({ categories }: { categories: Category[] }) {
  const router = usePathname();
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null
  );
  const [dropdownStyles, setDropdownStyles] =
    React.useState<React.CSSProperties>({});

  const shouldHide = router.includes("/dashboard");
  if (shouldHide) return null;

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleCategoryHover = (categoryId: string, index: number) => {
    const screenWidth = window.innerWidth;
    const midpoint = Math.floor(categories.length / 2);
    const isLeft = index < midpoint;
    const width = screenWidth < 768 ? screenWidth - 20 : 340;
    setDropdownStyles({
      left: isLeft ? "10px" : "auto",
      right: !isLeft ? "10px" : "auto",
      maxWidth: width,
      transform: "none",
    });
    setActiveCategory(categoryId);
  };

  const handleMenuLeave = () => {
    setActiveCategory(null);
  };

  return (
    <section className="hidden md:block w-full border-b bg-white/90 backdrop-blur-sm relative z-50">
      <nav className="px-2 min-h-12" onMouseLeave={handleMenuLeave}>
        <ul className="flex flex-wrap gap-1 justify-center max-w-screen-xl mx-auto">
          {categories?.map((category, index) => (
            <li key={category.id} className="relative">
              <button
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={() => handleCategoryHover(category.id, index)}
                className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-slate-700 hover:text-pink-600 hover:bg-pink-50 rounded transition-colors"
              >
                {category.name}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeCategory === category.id ? "-rotate-180" : ""
                  }`}
                />
              </button>
              {activeCategory === category.id && (
                <div
                  className="absolute top-full bg-white rounded shadow ring-1 ring-pink-100 p-3 mt-1 z-60 overflow-auto md:w-[200px] lg:w-[340px]"
                  style={dropdownStyles}
                  onMouseEnter={() => handleCategoryHover(category.id, index)}
                >
                  <div className="grid gap-3 w-full">
                    <Link
                      href={`/search?categoryId=${category.id}`}
                      className="block rounded px-2 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
                    >
                      All {category.name}
                    </Link>
                    {category.productSubcategory.length > 0 && (
                      <ul className="grid gap-1">
                        {category.productSubcategory.map((subcategory) => (
                          <li key={subcategory.id}>
                            <Link
                              href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
                              className="block rounded px-2 py-1 text-xs text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                            >
                              {subcategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    {category.brands.length > 0 && (
                      <ul className="grid gap-1 border-t border-pink-50 pt-2 mt-2">
                        {category.brands.map((brandItem) => (
                          <li key={brandItem.brand.id}>
                            <Link
                              href={`/search?categoryId=${brandItem.categoryId}&brandId=${brandItem.brand.id}`}
                              className="block rounded px-2 py-1 text-xs text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                            >
                              {brandItem.brand.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="h-px bg-pink-100" />
    </section>
  );
}
