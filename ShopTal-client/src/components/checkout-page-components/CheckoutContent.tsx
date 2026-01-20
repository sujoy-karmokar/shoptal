"use client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/shadcn-ui/input";
import {
  applyCouponAPI,
  createOrderAPI,
  createPaymentIntentAPI,
} from "@/lib/api";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import StripePaymentForm from "./StripePaymentForm";

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

const checkoutFormSchema = z.object({
  shippingAddress: z.string().min(1, "Shipping address is required"),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function CheckoutContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const form = useForm<CheckoutFormData, any, CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: "",
    },
  });

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

  // New: handle payment intent and show payment form
  const handleProceedToPayment = async (data: CheckoutFormData) => {
    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to pay.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }
    setShippingAddress(data.shippingAddress);
    try {
      const paymentIntent = await createPaymentIntentAPI(
        total,
        session?.user.accessToken
      );
      console.log(paymentIntent.data.clientSecret);
      setClientSecret(paymentIntent?.data.clientSecret);
      setShowPaymentForm(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to start payment.");
    }
  };

  // New: after payment success, place order
  const handlePaymentSuccess = async () => {
    setIsCreatingOrder(true);
    try {
      const orderPayload = {
        shippingAddress: shippingAddress,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        couponCode: couponCode ? couponCode : undefined,
      };
      await createOrderAPI("/orders", orderPayload, session?.user.accessToken);
      toast.success("Order placed successfully!");
      setCartItems([]);
      setDiscount(0);
      setCouponCode("");
      setShowPaymentForm(false);
      setClientSecret(null);
      router.push(`/profile/orders`);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const subtotal = calculateSubtotal();
  const total = subtotal - discount;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
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
                  fetchCartItems(session?.user.accessToken);
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
        Checkout
      </h1>
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Shipping Address Form */}
        <div className="lg:col-span-8 space-y-3">
          <Card className="border border-pink-100 shadow-none rounded-xl p-4">
            <CardTitle className="text-base font-semibold text-primary mb-4">
              Shipping Information
            </CardTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleProceedToPayment)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your shipping address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full text-sm bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md shadow-none transition-colors duration-150"
                  size="lg"
                  type="submit"
                  disabled={cartItems.length === 0 || isCreatingOrder}
                >
                  {isCreatingOrder ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Proceed to Payment
                </Button>
              </form>
            </Form>
          </Card>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <Card className="border border-pink-100 shadow-none">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Your cart is empty. Please add items before checking out.
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
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="w-6 text-center text-xs">
                          Qty: {item.quantity}
                        </span>
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
        {/* Order Summary */}
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
                <span className="text-muted-foreground">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-sm">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Stripe Payment Form Modal/Section */}
      {showPaymentForm && clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Payment</h2>
            <StripePaymentForm
              clientSecret={clientSecret}
              onPaymentSuccess={handlePaymentSuccess}
            />
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() => setShowPaymentForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
