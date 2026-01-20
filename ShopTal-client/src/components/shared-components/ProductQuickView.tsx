"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, X, Eye } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Badge } from "@/components/shadcn-ui/badge";
import { Product } from "@/types";
import { AddToCartButton } from "./AddToCartButton";

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({
  product,
  isOpen,
  onClose,
}: ProductQuickViewProps) {
  if (!product) return null;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square relative bg-gradient-to-br from-pink-50 to-white rounded-lg overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-400 text-6xl font-bold">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {/* Rating */}
              {product?.averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(product?.averageRating)}
                  </div>
                  {
                    <span className="text-sm text-gray-600">
                      ({product?._count?.reviews ?? 0} reviews)
                    </span>
                  }
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-pink-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.price > 100 && (
                  <span className="text-lg text-gray-500 line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                ✓ In Stock
              </Badge>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Key Features
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-pink-500 mt-1">•</span>
                        <span>{feature.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <AddToCartButton productId={product.id} />
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-pink-200 hover:border-pink-400 hover:bg-pink-50"
                >
                  <Link href={`/product/${product.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
