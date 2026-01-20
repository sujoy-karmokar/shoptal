
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn-ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn-ui/alert-dialog";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Coupon } from "@/types";

interface CouponActionsProps {
  coupon: Coupon;
  fetchData: ({
    pageIndex,
    pageSize,
    searchTerm,
    sorting,
  }: {
    pageIndex: number;
    pageSize: number;
    searchTerm: string;
    sorting: any;
  }) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function CouponActions({ coupon, fetchData }: CouponActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/coupons/${coupon.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken || ""}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete coupon");
      }

      fetchData({
        pageIndex: 0,
        pageSize: 10,
        searchTerm: "",
        sorting: [],
      });

      toast.success(`Coupon "${coupon.code}" has been deleted successfully`);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete the coupon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/dashboard/coupons/edit/${coupon.id}`}>
          Edit
          <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={"default"}
            size={"sm"}
            className={"bg-red-500"}
            disabled={isLoading}
          >
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete coupon: {coupon.code}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-500">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
