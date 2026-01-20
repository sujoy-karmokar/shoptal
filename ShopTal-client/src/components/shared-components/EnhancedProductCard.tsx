"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, Package } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import { Card, CardContent, CardHeader } from "@/components/shadcn-ui/card";
import { Product } from "@/types";
import { ProductQuickView } from "./ProductQuickView";
import { toast } from "sonner";

interface EnhancedProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  showQuickActions?: boolean;
  priority?: boolean;
  className?: string;
}

export function EnhancedProductCard({
  product,
  variant = "default",
  showQuickActions = true,
  priority = false,
  className = "",
}: EnhancedProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInStock] = useState(true); // TODO: Get from API
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleQuickView = () => {
    setShowQuickView(true);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "min-h-[200px] h-auto";
      case "featured":
        return "min-h-[240px] h-auto";
      default:
        return "min-h-[220px] h-auto";
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case "compact":
        return "h-40";
      case "featured":
        return "h-56";
      default:
        return "h-48";
    }
  };

  return (
    <Card
      className={`group relative overflow-hidden border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl ${getVariantClasses()} flex flex-col ${className}`}
    >
      {/* Quick Actions Overlay */}
      {showQuickActions && (
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white shadow-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWishlistToggle();
            }}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted
                  ? "text-red-500 fill-current"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white shadow-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleQuickView();
            }}
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      )}

      {/* Stock Status Badge */}
      {isInStock && (
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 text-xs font-medium"
          >
            <Package className="h-3 w-3 mr-1" />
            In Stock
          </Badge>
        </div>
      )}

      {/* Product Image */}
      <CardHeader className="p-0 relative">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <div
            className={`relative ${getImageHeight()} bg-gradient-to-br from-pink-50 to-white flex items-center justify-center overflow-hidden`}
          >
            {product.image ? (
              <>
                <Image
                  src={product.image}
                  alt={`${product.name} - High-quality product available at ShopTal`}
                  width={400}
                  height={400}
                  className={`w-full ${getImageHeight()} object-contain transition-all duration-300 group-hover:scale-105 bg-white ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  priority={priority}
                  loading={priority ? "eager" : "lazy"}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div
                    className={`absolute inset-0 ${getImageHeight()} bg-pink-100 animate-pulse flex items-center justify-center`}
                  >
                    <div className="text-pink-400 text-2xl font-bold">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                className={`w-full ${getImageHeight()} flex items-center justify-center bg-pink-100 text-pink-400 text-4xl font-bold rounded-md`}
              >
                {product.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>
      </CardHeader>

      {/* Product Info */}
      <CardContent className="p-3 flex-1 flex flex-col justify-between min-h-[120px]">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2 leading-tight text-sm sm:text-base mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-pink-600">
              ${product.price.toFixed(2)}
            </span>
            {product.price > 100 && (
              <span className="text-sm text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            )}
          </div>
          {/* Category */}
          {product?.category?.name && (
            <Badge variant="outline" className="text-xs w-fit">
              {product?.category?.name}
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Quick View Modal */}
      <ProductQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </Card>
  );
}
