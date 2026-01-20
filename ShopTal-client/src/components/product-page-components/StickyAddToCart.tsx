"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { AddToCartButton } from "@/components/shared-components/AddToCartButton";

interface StickyAddToCartProps {
  productId: string;
  productName: string;
  price: number;
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
}

export default function StickyAddToCart({
  productId,
  productName,
  price,
  isWishlisted = false,
  onWishlistToggle
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky cart when user scrolls past the original add to cart button
      const addToCartSection = document.getElementById('add-to-cart-section');
      if (addToCartSection) {
        const rect = addToCartSection.getBoundingClientRect();
        setIsVisible(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {productName}
          </p>
          <p className="text-lg font-bold text-pink-600">
            ${price.toFixed(2)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onWishlistToggle}
            className={`h-10 w-10 ${
              isWishlisted
                ? "text-red-600 border-red-200 bg-red-50"
                : "text-gray-600"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>

          <div className="w-32">
            <AddToCartButton productId={productId} />
          </div>
        </div>
      </div>
    </div>
  );
}