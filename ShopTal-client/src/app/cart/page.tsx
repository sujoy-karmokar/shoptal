"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/shadcn-ui/input";
import { applyCouponAPI } from "@/lib/api";

interface CartItem {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: CartItem[];
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const fetchCartItems = useCallback(
    async (accessToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/cart-items/user-items`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data: ApiResponse = await response.json();
        setCartItems(data.data);
      } catch (error) {
        setError("Failed to fetch cart items");
        toast.error("Could not load your cart items. Please try again later.");
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL]
  );

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!session?.user?.accessToken) return;
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      const response = await fetch(`${API_BASE_URL}/cart-items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      toast.success("Cart quantity updated successfully");
    } catch (error) {
      toast.error("Failed to update quantity. Please try again.");
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const removeItem = async (itemId: string) => {
    if (!session?.user?.accessToken) return;
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      const response = await fetch(`${API_BASE_URL}/cart-items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item. Please try again.");
      console.error("Error removing item:", error);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Please login first");
      router.push("/login");
      return;
    }
    if (session?.user?.accessToken) {
      fetchCartItems(session.user.accessToken);
    }
  }, [session, status, router, fetchCartItems]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const handleApplyCoupon = async () => {
    if (!session?.user?.accessToken) {
      toast.error("Please login to apply a coupon.");
      return;
    }
    try {
      const res: any = await applyCouponAPI(
        "/coupons/apply",
        {
          couponCode,
          totalAmount: calculateSubtotal(),
        },
        session.user.accessToken
      );
      const newTotal = res.data;
      setDiscount(calculateSubtotal() - newTotal);
      toast.success("Coupon applied successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to apply coupon.");
    }
  };

  const subtotal = calculateSubtotal();
  const total = subtotal - discount;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                if (session?.user?.accessToken) {
                  fetchCartItems(session.user.accessToken);
                }
              }}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8 min-h-[70vh]">
      <h1 className="text-xl font-bold mb-6 tracking-tight text-primary">
        Shopping Cart
      </h1>
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-3">
          {cartItems.length === 0 ? (
            <Card className="border border-pink-100 shadow-none">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Your cart is empty
                </p>
                <Link href={"/search"}>
                  <Button className="mt-4 text-sm" variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            cartItems.map((item) => (
              <Card
                key={item.id}
                className="border border-pink-100 shadow-none rounded-xl"
              >
                <CardContent className="p-4">
                  <div className="flex gap-3 items-center">
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.product.id}`}
                      className="relative w-16 h-16 block"
                    >
                      <Image
                        src={item?.product.image}
                        alt={item?.product.name}
                        fill
                        className="rounded object-cover border border-pink-50"
                        sizes="(max-width: 64px) 100vw, 64px"
                      />
                    </Link>
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-medium text-sm truncate text-primary hover:text-pink-600 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          disabled={updatingItems.has(item.id)}
                        >
                          {updatingItems.has(item.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={() =>
                              item.quantity > 1 &&
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 text-xs"
                            disabled={
                              item.quantity <= 1 || updatingItems.has(item.id)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 text-xs"
                            disabled={updatingItems.has(item.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-semibold text-xs text-pink-600">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {/* Cart Summary */}
        <div className="lg:col-span-4">
          <Card className="border border-pink-100 shadow-none rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-primary">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button onClick={handleApplyCoupon}>Apply</Button>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">
                  Calculated at checkout
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-sm">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout">
                <Button
                  className="w-full text-sm bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md shadow-none transition-colors duration-150"
                  size="lg"
                  disabled={cartItems?.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
