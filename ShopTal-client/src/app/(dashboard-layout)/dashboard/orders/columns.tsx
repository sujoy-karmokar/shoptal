"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { DataTableColumnHeader } from "@/components/dashboard-page-components/DataTableColumnHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import { Button } from "@/components/shadcn-ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/shadcn-ui/badge";

export const columns = (
  onStatusChange: (orderId: string, status: string) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const order = row.original;
      return <div>{order.userId}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onStatusChange(order.id, "PROCESSING")}
            >
              Mark as Processing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(order.id, "SHIPPED")}
            >
              Mark as Shipped
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(order.id, "DELIVERED")}
            >
              Mark as Delivered
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(order.id, "CANCELED")}
            >
              Mark as Canceled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
