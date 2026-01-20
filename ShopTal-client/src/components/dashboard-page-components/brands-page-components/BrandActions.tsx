
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

interface Brand {
  id: string;
  name: string;
}

interface BrandActionsProps {
  brand: Brand;
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

export function BrandActions({ brand, fetchData }: BrandActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleDelete = async () => {
    if (!session?.user?.accessToken) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/brands/${brand.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete brand");
      }

      fetchData({
        pageIndex: 0,
        pageSize: 10,
        searchTerm: "",
        sorting: [],
      });

      toast.success(`Brand "${brand.name}" has been deleted successfully`);
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete the brand");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/dashboard/brands/edit/${brand.id}`}>
          Edit
          <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoading}
          >
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete brand: {brand.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-500">
              Warning: If this brand is associated with any product, it will not
              be deleted.
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
