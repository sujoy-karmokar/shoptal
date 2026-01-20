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
import { ProductActions } from "@/components/dashboard-page-components/products-page-components/ProductActions";

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
        return <div className=" font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <div className="">{row.getValue("quantity")}</div>,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return <ProductActions product={product} fetchData={fetchData} />;
      },
    },
  ];

  // const fetchData = async ({
  //   pageIndex,
  //   pageSize,
  //   searchTerm,
  //   sorting,
  // }: {
  //   pageIndex: number;
  //   pageSize: number;
  //   searchTerm: string;
  //   sorting: any;
  // }) => {
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/v1/products?page=${
  //         pageIndex + 1
  //       }&limit=${pageSize}&searchTerm=${searchTerm}&sort=${JSON.stringify(
  //         sorting
  //       )}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           // Add any authentication headers if required
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch products");
  //     }

  //     const result = await response.json();
  //     const totalItems = result.data.meta.total;
  //     const itemsPerPage = result.data.meta.limit;
  //     const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

  //     setData(result.data.data);
  //     setTotalPages(calculatedTotalPages);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     // Handle error state here (e.g., show an error message to the user)
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
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
          `${API_BASE_URL}/products?page=${
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
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();
        const totalItems = result.data.meta.total;
        const itemsPerPage = result.data.meta.limit;
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

        setData(result.data.data);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL]
  );

  return (
    <ContentLayout title="Products">
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
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <PlaceholderContent /> */}
      <Link href="/dashboard/products/new">
        <Button>Add New Product</Button>
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
