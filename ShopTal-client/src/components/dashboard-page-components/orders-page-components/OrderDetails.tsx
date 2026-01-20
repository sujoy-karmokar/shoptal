"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Order, OrderItem } from "@/types";
import { format } from "date-fns";
import {
  Loader2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { getOrderById, updateOrderStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { Separator } from "@/components/shadcn-ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/shadcn-ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-ui/table";

interface OrderDetailsProps {
  orderId: string;
}

const statusIcons: { [key: string]: React.ElementType } = {
  PENDING: Clock,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELED: XCircle,
};

const statusColors: { [key: string]: string } = {
  PENDING: "bg-yellow-500",
  PROCESSING: "bg-blue-500",
  SHIPPED: "bg-indigo-500",
  DELIVERED: "bg-green-500",
  CANCELED: "bg-red-500",
};

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const fetchOrder = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setIsLoading(true);
    try {
      const res: any = await getOrderById(orderId, session.user.accessToken);
      // const foundOrder = res.data.find((o: Order) => o.id === orderId);
      const foundOrder = res.data;
      if (foundOrder) {
        setOrder(foundOrder);
        setSelectedStatus(foundOrder.status);
      } else {
        toast.error("Order not found.");
        router.push("/dashboard/orders");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch order details.");
      router.push("/dashboard/orders");
    } finally {
      setIsLoading(false);
    }
  }, [orderId, session?.user?.accessToken, router]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchOrder();
    }
  }, [orderId, session, fetchOrder]);

  const handleStatusChange = async () => {
    if (!session?.user?.accessToken || !order || !selectedStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(
        order.id,
        selectedStatus,
        session.user.accessToken
      );
      toast.success("Order status updated successfully!");
      setOrder((prev) =>
        prev ? { ...prev, status: selectedStatus as Order["status"] } : null
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{order.id.substring(0, 8)}...
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "PPP p")}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Badge className={`text-white text-xs ${statusColors[order.status]}`}>
            <StatusIcon className="h-3 w-3 mr-1.5" />
            {order.status}
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems.map((item: OrderItem) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/product/${item.productId}`}
                            className="relative w-16 h-16 block flex-shrink-0"
                          >
                            <Image
                              src={item.product?.image || "/placeholder.svg"}
                              alt={item.product?.name || "Product Image"}
                              fill
                              className="rounded-md object-cover"
                            />
                          </Link>
                          <div>
                            <Link
                              href={`/product/${item.productId}`}
                              className="font-medium hover:underline"
                            >
                              {item.product?.name || "Unknown Product"}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              ID: {item.productId.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                User ID: {order.userId}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Shipping Address:</strong>
                <br />
                {order.shippingAddress}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStatusChange}
                disabled={isUpdatingStatus || selectedStatus === order.status}
                className="w-full"
              >
                {isUpdatingStatus && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
