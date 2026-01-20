import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../shadcn-ui/button";

type Category = {
  id: string;
  name: string;
  image: string;
};

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories?limit=10&sortBy=createdAt&sortOrder=desc`,
    { next: { revalidate: 60 } }
    // { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.data.data;
}

// Utility to generate a color from a string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 70%)`;
  return color;
}

export default async function Categories() {
  const categories = await fetchCategories();

  return (
    <section className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Discover products in your favorite categories
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-pink-200 hover:border-pink-400 hover:bg-pink-50 self-center sm:self-auto"
        >
          <Link href="/categories" className="flex items-center gap-2">
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/search?categoryId=${category.id}`}
            className="group flex flex-col items-center justify-center bg-white rounded-xl border border-pink-100 hover:border-pink-400 shadow-sm hover:shadow-md transition-all duration-300 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 mx-auto relative overflow-hidden hover:scale-[1.02] hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 mt-2 mb-3 rounded-full border border-pink-100 bg-gray-50 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <span
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold select-none"
                style={{
                  color: "#fff",
                  background: stringToColor(category.name),
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                }}
              >
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center z-10 relative text-primary group-hover:text-pink-600 transition-colors duration-200 px-1 leading-tight">
              {category.name.length > 12 ? category.name.slice(0, 12) + "..." : category.name}
            </h3>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/60 to-pink-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 rounded-xl" />
          </Link>
        ))}
      </div>
    </section>
  );
}
