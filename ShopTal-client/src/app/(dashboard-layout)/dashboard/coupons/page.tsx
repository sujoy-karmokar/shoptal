"use client";

import ContentLayout from "@/components/dashboard-page-components/ContentLayout";
import { DataTable } from "@/components/dashboard-page-components/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/shadcn-ui/breadcrumb";
import { Button } from "@/components/shadcn-ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Coupon } from "@/types";
import { CouponActions } from "@/components/dashboard-page-components/coupons-page-components/CouponActions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function CouponsPage() {
  const [data, setData] = useState<Coupon[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const columns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "discountType",
      header: "Discount Type",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("discountType")}</div>
      ),
    },
    {
      accessorKey: "discountValue",
      header: "Discount Value",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("discountValue")}</div>
      ),
    },
    {
      accessorKey: "expirationDate",
      header: "Expiration Date",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Date(row.getValue("expirationDate")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "usageLimit",
      header: "Usage Limit",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("usageLimit")}</div>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const coupon = row.original;
        return <CouponActions coupon={coupon} fetchData={fetchData} />;
      },
    },
  ];
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const fetchData = useCallback(
    async ({
      pageIndex,
      pageSize,
      searchTerm,
      sorting,
    }: {
      pageIndex: number;
      pageSize: number;
      searchTerm: string;
      sorting: any;
    }) => {
      if (status !== "authenticated" || !session?.user.accessToken) {
        // Optionally show a toast or redirect to login
        setData([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/coupons?page=${
            pageIndex + 1
          }&limit=${pageSize}&searchTerm=${searchTerm}&sort=${JSON.stringify(
            sorting
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("Session expired. Please log in again.");
            // Optionally redirect to login
          }
          throw new Error("Failed to fetch coupons");
        }

        const result = await response.json();
        const totalItems = result.data.meta.total;
        const itemsPerPage = result.data.meta.limit;
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

        setData(result.data.data);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL, session?.user.accessToken, status]
  );
  return (
    <ContentLayout title="Coupons">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Coupons</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Link href="/dashboard/coupons/new">
        <Button>Add New Coupon</Button>
      </Link>
      <div className="mt-2">
        <DataTable
          columns={columns}
          data={data}
          fetchData={fetchData}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </ContentLayout>
  );
}
