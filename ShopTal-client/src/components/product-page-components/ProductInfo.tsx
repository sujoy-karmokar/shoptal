"use client";

import { Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import { Separator } from "@/components/shadcn-ui/separator";
import { AddToCartButton } from "@/components/shared-components/AddToCartButton";
import { FeaturesList } from "./FeaturesList";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: { name: string; value: string }[];
    averageRating: number;
    reviews?: any[];
  };
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
  onShare?: () => void;
}

export default function ProductInfo({
  product,
  isWishlisted = false,
  onWishlistToggle,
  onShare
}: ProductInfoProps) {

  return (
    <div className="space-y-6">
      {/* Product Title and Actions */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              In Stock
            </Badge>
            <span className="text-sm text-gray-500">Free shipping</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onWishlistToggle}
            className={`transition-colors ${
              isWishlisted
                ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                : "text-gray-600 hover:text-red-600"
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
            className="text-gray-600 hover:text-blue-600"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(product.averageRating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {product.averageRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-bold text-gray-900">
            ${(product.price || 0).toFixed(2)}
          </span>
          <span className="text-lg text-gray-500 line-through">
            ${((product.price || 0) * 1.2).toFixed(2)}
          </span>
          <Badge className="bg-green-600 hover:bg-green-700">
            Save 17%
          </Badge>
        </div>
        <p className="text-sm text-green-600 font-medium">
          ✓ Price match guarantee
        </p>
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Free Delivery</p>
            <p className="text-xs text-gray-600">2-3 business days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">2 Year Warranty</p>
            <p className="text-xs text-gray-600">Full coverage</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Easy Returns</p>
            <p className="text-xs text-gray-600">30-day policy</p>
          </div>
        </div>
      </div>

      {/* Add to Cart Section */}
      <div className="space-y-4">
        <Separator />
        <AddToCartButton productId={product.id} />
      </div>

      {/* Description */}
      <div className="space-y-4">
        <Separator />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <Separator />
        <FeaturesList features={product.features} />
      </div>
    </div>
  );
}