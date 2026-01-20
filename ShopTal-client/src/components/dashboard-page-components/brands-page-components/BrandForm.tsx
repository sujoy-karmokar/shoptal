"use client";

import { Button } from "@/components/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Select from "react-select";
import { useSession } from "next-auth/react";

// Define the schema for form validation
const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  categories: z.array(
    z.object({
      value: z.string().uuid({ message: "Select UUID of a category" }),
      label: z.string(),
    })
  ),
});

export default function BrandForm({ brandId }: { brandId?: string }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!!brandId);
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof FormSchema>, any, z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      categories: [],
    },
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategories = useCallback(async () => {
    try {
      const data = await fetch(`${API_BASE_URL}/categories?limit=100`, {
        method: "GET",
      });
      const categoriesResponse = await data.json();

      const selectCategories = categoriesResponse?.data?.data.map(
        (category: { id: string; name: string }) => ({
          value: category.id,
          label: category.name,
        })
      );

      setCategories(selectCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories. Please try again.");
    }
  }, [API_BASE_URL]);

  const fetchBrand = useCallback(
    async (accessToken: string) => {
      if (!brandId) return;
      try {
        const response = await fetch(`${API_BASE_URL}/brands/${brandId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch brand data");
        }

        const brandData = await response.json();

        const selectedCategories =
          brandData.data.categories?.map(
            (cat: { category: { id: string; name: string } }) => ({
              value: cat.category.id,
              label: cat.category.name,
            })
          ) || [];

        form.reset({
          name: brandData.data.name,
          categories: selectedCategories,
        });
      } catch (error) {
        console.error("Error fetching brand:", error);
        toast.error("Failed to fetch brand data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [brandId, API_BASE_URL, form]
  );

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Please login to access this page.");
      return;
    }

    fetchCategories();
    if (brandId && session?.user?.accessToken) {
      fetchBrand(session.user.accessToken as string);
    }
  }, [brandId, session, status, fetchBrand, fetchCategories]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const url = brandId
        ? `${API_BASE_URL}/brands/${brandId}`
        : `${API_BASE_URL}/brands`;
      const method = brandId ? "PATCH" : "POST";

      const payload = {
        name: data.name,
        categories: data.categories.map((cat) => cat.value),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok && !brandId) {
        form.reset();
      }

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to process request");
      }

      const responseData = await response.json();
      toast(responseData.message, { duration: 960 });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message, { duration: 960 });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>
            Place Brand Under Categories To Showup In Navigation Menu
          </FormLabel>
          <Controller
            name="categories"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Select
                isMulti
                options={categories}
                value={value}
                onChange={onChange}
                placeholder="Select categories..."
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
          <FormMessage />
        </FormItem>

        <Button type="submit">{brandId ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}
