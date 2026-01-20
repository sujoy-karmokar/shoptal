import { EnhancedProductCard } from "@/components/shared-components/EnhancedProductCard";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <EnhancedProductCard
      product={product}
      variant="default"
      showQuickActions={true}
      priority={false}
    />
  );
}
