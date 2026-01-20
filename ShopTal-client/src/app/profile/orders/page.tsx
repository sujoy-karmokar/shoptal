"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getOrders } from "@/lib/api";
import { Order } from "@/types";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Badge } from "@/components/shadcn-ui/badge";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn-ui/accordion";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

function OrderCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-6 w-20 ml-auto" />
          <Skeleton className="h-5 w-28 ml-auto" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function UserOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (session?.user?.accessToken) {
        try {
          setLoading(true);
          const res = (await getOrders(session.user.accessToken)) as {
            data: Order[];
          };
          setOrders(res.data);
        } catch (error) {
          console.error("Failed to fetch orders", error);
          toast.error("Failed to fetch your orders.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserOrders();
  }, [session]);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      {loading ? (
        <div className="space-y-6">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
          <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-500">
            You have no orders yet.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            When you place an order, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-start bg-gray-50 dark:bg-gray-800/50 p-4 md:p-6">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.id.substring(0, 8)}...
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      order.status === "PENDING" ? "default" : "secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                  <p className="text-lg font-semibold mt-1">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  <AccordionItem value={order.id} className="border-none">
                    <AccordionTrigger className="p-4 md:p-6 text-sm font-medium">
                      View Details
                    </AccordionTrigger>
                    <AccordionContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Items</h4>
                          <ul className="space-y-3">
                            {order.orderItems.map((item) => (
                              <li
                                key={item.id}
                                className="flex items-center gap-4"
                              >
                                {item.product?.image && (
                                  <Image
                                    src={item.product.image}
                                    alt={item.product?.name || "Product"}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 object-cover rounded-md border"
                                  />
                                )}
                                <div className="flex-grow">
                                  <Link href={`/product/${item.productId}`}>
                                    <p className="font-medium">
                                      {item.product?.name || item.productId}
                                    </p>
                                  </Link>
                                  <p className="text-sm text-gray-500">
                                    {item.quantity} x ${item.price.toFixed(2)}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Shipping Address
                          </h4>
                          <p className="text-sm text-gray-500">
                            {order.shippingAddress}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
