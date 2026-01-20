"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../shadcn-ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn-ui/select";

interface AddToCartButtonProps {
  productId: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const AddToCartButton = ({ productId }: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { data: session } = useSession();

  const handleAddToCart = async () => {
    if (!session) {
      toast.info("Please log in to add items to your cart.", {
        action: {
          label: "Login",
          onClick: () =>
            router.push(`/login?callbackUrl=/product/${productId}`),
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add item to cart");
      }

      toast.success("Product added to cart!");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Quantity
        </span>
        <Select
          value={String(quantity)}
          onValueChange={(value) => setQuantity(Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="1" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(10)].map((_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        size="lg"
        className="flex-grow"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          "Adding..."
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
};
