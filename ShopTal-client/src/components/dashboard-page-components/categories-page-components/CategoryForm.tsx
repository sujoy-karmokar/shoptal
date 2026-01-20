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
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
});

export default function CategoryForm({ categoryId }: { categoryId?: string }) {
  const [loading, setLoading] = useState(!!categoryId);
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof FormSchema>, any, z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategory = useCallback(async (accessToken: string) => {
    if (!categoryId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch category data");
      }

      const categoryData = await response.json();
      form.reset({
        name: categoryData.data.name,
      });
    } catch (error) {
      console.error("Error fetching category:", error);
      toast("Failed to fetch category data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [categoryId, API_BASE_URL, form]);

  useEffect(() => {
    if (categoryId && session?.user?.accessToken) {
      fetchCategory(session.user.accessToken as string);
    }
  }, [categoryId, session, fetchCategory]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const url = categoryId
        ? `${API_BASE_URL}/categories/${categoryId}`
        : `${API_BASE_URL}/categories`;
      const method = categoryId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok && !categoryId) form.reset();

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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{categoryId ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}
