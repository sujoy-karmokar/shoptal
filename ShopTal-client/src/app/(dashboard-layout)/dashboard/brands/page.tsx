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
import { BrandActions } from "@/components/dashboard-page-components/brands-page-components/BrandActions";

export type Brand = {
  id: string;
  name: string;
};

export default function BrandsPage() {
  const [data, setData] = useState<Brand[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const brand = row.original;
        return <BrandActions brand={brand} fetchData={fetchData} />;
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
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/brands?page=${
            pageIndex + 1
          }&limit=${pageSize}&searchTerm=${searchTerm}&sort=${JSON.stringify(
            sorting
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const result = await response.json();
        const totalItems = result.data.meta.total;
        const itemsPerPage = result.data.meta.limit;
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

        setData(result.data.data);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL]
  );
  return (
    <ContentLayout title="Brands">
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
            <BreadcrumbPage>Brands</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <PlaceholderContent /> */}
      <Link href="/dashboard/brands/new">
        <Button>Add New Brand</Button>
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
