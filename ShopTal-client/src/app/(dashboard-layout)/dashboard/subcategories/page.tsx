"use client";

import ContentLayout from "@/components/dashboard-page-components/ContentLayout";
import { DataTable } from "@/components/dashboard-page-components/data-table";
import { DataTableColumnHeader } from "@/components/dashboard-page-components/DataTableColumnHeader";
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
import { SubcategoryActions } from "@/components/dashboard-page-components/subcategories-page-components/SubcategoryActions";

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  createdAt: Date;
  updateAt: Date;
};

export default function SubcategoriesPage() {
  const [data, setData] = useState<Subcategory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Subcategory>[] = [
    {
      accessorKey: "id",
      // header: "ID",
      header: ({ column }) => (
        <DataTableColumnHeader className="ml-2" column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      // header: "Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "categoryId",
      // header: "Category ID",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category ID" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("categoryId")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      // header: "CreatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CreatedAt" />
      ),
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div>{new Date(date).toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "updatedAt",
      // header: "UpdatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="UpdatedAt" />
      ),
      cell: ({ row }) => {
        const date: Date = row.getValue("updatedAt");
        return <div>{new Date(date).toLocaleString()}</div>;
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const subcategory = row.original;
        return (
          <SubcategoryActions subcategory={subcategory} fetchData={fetchData} />
        );
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
          `${API_BASE_URL}/subcategories?page=${
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
    <ContentLayout title="Subcategories">
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
            <BreadcrumbPage>Subcategories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <PlaceholderContent /> */}
      <Link href="/dashboard/subcategories/new">
        <Button>Add New Subcategory</Button>
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
