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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EditProductFormSkeleton } from "./EditProductFormSkeleton";
import Image from "next/image";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { useSession } from "next-auth/react";

const FormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters." }),
  price: z.coerce
    .number()
    .min(1, { message: "Product price must be provided." }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Product quantity must be provided." }),
  brandId: z.string({ message: "Brand for product must be selected" }),
  categoryId: z.string({ message: "Category for product must be selected" }),
  subcategoryId: z.string({
    message: "Subcategory for product must be selected.",
  }),
  file: z.any().optional(),
  existingImage: z.string().optional(),
  // features: z
  //   .array(
  //     z.object({
  //       id: z.string().optional(),
  //       name: z.string().min(1, { message: "Feature name must be provided." }),
  //       value: z
  //         .string()
  //         .min(1, { message: "Feature value must be provided." }),
  //     })
  //   )
  //   .nonempty({ message: "At least one feature is required." }),
  description: z
    .string()
    .min(2, { message: "Product description must be at least 2 characters." }),
});

export default function EditProductForm({ productId }: { productId: string }) {
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof FormSchema>, any, z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      brandId: "",
      categoryId: "",
      subcategoryId: "",
      file: "",
      existingImage: "",
      // features: [{ name: "", value: "" }],
      description: "",
    },
  });

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "features",
  // });

  const fetchSubcategories = useCallback(
    async (categoryId: string) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/subcategories?categoryId=${categoryId}&limit=100`
        );
        const data = await res.json();
        setSubcategories(data.data.data);
      } catch (error) {
        toast.error("Failed to fetch subcategories");
      }
    },
    [API_BASE_URL]
  );

  // Fetch product details for editing
  const fetchProductDetails = useCallback(
    async (accessToken: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { data } = await response.json();

        // First fetch subcategories for the product's category
        if (data.categoryId) {
          await fetchSubcategories(data.categoryId);
        }

        // Then reset form with all data including subcategoryId
        form.reset({
          id: data.id,
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          brandId: data.brandId,
          categoryId: data.categoryId,
          subcategoryId: data.subcategoryId || "null",
          existingImage: data.image,
          // features:
          //   data.features.length > 0 ? data.features : [{ name: "", value: "" }],
          description: data.description,
        });

        // Set image preview
        if (data.image) {
          setPreview(data.image);
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
      } finally {
        setIsLoading(false);
      }
    },
    [productId, API_BASE_URL, fetchSubcategories, form]
  );

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue("file", file);
      form.setValue("existingImage", "");
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories?limit=100`);
      const data = await res.json();
      setCategories(data.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  }, [API_BASE_URL]);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/brands?limit=100`);
      const data = await res.json();
      setBrands(data.data.data);
    } catch (error) {
      toast.error("Failed to fetch brands");
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    const initializeForm = async () => {
      await Promise.all([fetchBrands(), fetchCategories()]);
      if (session?.user?.accessToken) {
        fetchProductDetails(session.user.accessToken as string);
      }
    };
    initializeForm();
  }, [session, fetchBrands, fetchCategories, fetchProductDetails]);

  // Handle category change
  const categoryId = form.watch("categoryId");
  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    }
  }, [categoryId, fetchSubcategories, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("quantity", data.quantity.toString());
    formData.append("brandId", data.brandId);
    formData.append("categoryId", data.categoryId);
    // formData.append("subcategoryId", data.subcategoryId);
    // Correctly handle subcategoryId
    formData.append(
      "subcategoryId",
      data.subcategoryId === "null" ? "" : data.subcategoryId
    );
    // formData.append("features", JSON.stringify(data.features));

    formData.append("description", data.description);

    if (data.file) {
      formData.append("file", data.file);
    } else if (data.existingImage) {
      formData.append("existingImage", data.existingImage);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product");
    }
  };

  if (isLoading) {
    return <EditProductFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                <Input placeholder="Product price" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder="Product quantity"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand: { name: string; id: string }) => (
                    <SelectItem key={brand?.id} value={brand?.id}>
                      {brand?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: { name: string; id: string }) => (
                    <SelectItem key={category?.id} value={category?.id}>
                      {category?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem key="null" value="null">
                    No Subcategory
                  </SelectItem>
                  {subcategories.map(
                    (subcategory: { name: string; id: string }) => (
                      <SelectItem key={subcategory?.id} value={subcategory?.id}>
                        {subcategory?.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  placeholder="Product description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <Input type="file" onChange={handleFileChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2>Image Preview:</h2>
        <Image
          src={preview}
          width={300}
          height={300}
          alt="Image Preview"
          className="drop-shadow-xl"
        />

        {/* <div>
          <h2>Features:</h2>
          {fields.map((item, index) => (
            <div key={item.id} className="flex space-x-4 items-center">
              <FormField
                control={form.control}
                name={`features.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Feature name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`features.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Feature value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="mt-8"
                type="button"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            className="mt-4"
            type="button"
            onClick={() => append({ name: "", value: "" })}
          >
            Add Feature
          </Button>
        </div> */}

        <Button type="submit">Update Product</Button>
      </form>
    </Form>
  );
}
