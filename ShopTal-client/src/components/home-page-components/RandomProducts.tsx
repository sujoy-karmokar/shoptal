import { EnhancedProductCard } from "../shared-components/EnhancedProductCard";
import { Product } from "@/types";

async function fetchRandomProducts(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?random=true&limit=8`,
    // { cache: "no-store" },
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch random products");
  const data = await res.json();

  // Transform the API response to match the Product type
  return data.data.data.map((item: Product) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    description: item.description || "",
    features: item.features || [],
    category: item.category || "",
    reviews: item?.reviews || [],
    averageRating: item.averageRating || 0,
    _count: item._count,
  }));
}

export default async function RandomProducts() {
  const randomProducts = await fetchRandomProducts();

  return (
    <section className="mb-14">
      <h2 className="text-3xl font-bold mb-6 text-primary">Discover More</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {randomProducts.map((product) => (
          <EnhancedProductCard
            key={product.id}
            product={product}
            variant="compact"
            showQuickActions={true}
            priority={false}
          />
        ))}
      </div>
    </section>
  );
}
