"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import StickyAddToCart from "./StickyAddToCart";

interface ProductPageLayoutProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: { name: string; value: string }[];
    averageRating: number;
    reviews?: any[];
    image?: string;
  };
  children?: React.ReactNode; // For reviews section
}

export default function ProductPageLayout({
  product,
  children
}: ProductPageLayoutProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock multiple images - in real app, this would come from the product data
  const productImages = product.image ? [product.image] : ["/placeholder.svg"];

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Product shared successfully!");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {product.name}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="order-2 lg:order-1">
            <ProductImageGallery
              images={productImages}
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="order-1 lg:order-2">
            <ProductInfo
              product={product}
              isWishlisted={isWishlisted}
              onWishlistToggle={handleWishlistToggle}
              onShare={handleShare}
            />
          </div>
        </div>

        {/* Reviews Section */}
        {children && (
          <div className="mt-12 lg:mt-16">
            {children}
          </div>
        )}
      </div>

      {/* Sticky Add to Cart - Mobile Only */}
      <StickyAddToCart
        productId={product.id}
        productName={product.name}
        price={product.price}
        isWishlisted={isWishlisted}
        onWishlistToggle={handleWishlistToggle}
      />
    </div>
  );
}