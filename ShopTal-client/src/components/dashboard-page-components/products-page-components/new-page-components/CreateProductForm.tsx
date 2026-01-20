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
import { Textarea } from "@/components/shadcn-ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSession } from "next-auth/react";

const FormSchema = z.object({
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
  file: z.any({ message: "Image file must be selected" }),
  // features: z.array(
  //   z.object({
  //     name: z.string().min(1, { message: "Feature name must be provided." }),
  //     value: z.string().min(1, { message: "Feature value must be provided." }),
  //   })
  // ),
  // .nonempty({ message: "At least one feature is required." }),
  description: z.string(),
});

export default function CreateProductForm() {
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
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
      // features: [{ name: "", value: "" }],
      description: "",
    },
  });

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "features",
  // });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue("file", file);
    }
  };

  const fetchCategories = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/categories?limit=100`);
    const data = await res.json();
    setCategories(data.data.data);
  }, [API_BASE_URL]);

  const fetchSubcategories = useCallback(
    async (categoryId: string) => {
      const res = await fetch(
        `${API_BASE_URL}/subcategories?categoryId=${categoryId}&limit=100`
      );
      const data = await res.json();
      setSubcategories(data.data.data);
    },
    [API_BASE_URL]
  );

  const fetchBrands = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/brands?limit=100`);
    const data = await res.json();
    setBrands(data.data.data);
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  const categoryId = form.watch("categoryId");
  useEffect(() => {
    if (categoryId) fetchSubcategories(categoryId);
  }, [categoryId, fetchSubcategories, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("quantity", data.quantity.toString());
    formData.append("brandId", data.brandId);
    formData.append("categoryId", data.categoryId);
    formData.append("description", data.description);
    // formData.append("subcategoryId", data.subcategoryId);
    formData.append(
      "subcategoryId",
      data.subcategoryId === "null" ? "" : data.subcategoryId
    );
    // formData.append("features", JSON.stringify(data.features));

    if (data.file) {
      formData.append("file", data.file);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      toast.success(responseData.message, {
        duration: 960,
        position: "top-center",
      });
    } catch (error: any) {
      console.log("Product creation failed error:", error);
      toast.error(error.message, { duration: 900 });
    }
  };

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormLabel>Subcategory (optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  // type="number"
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
          src={preview || "/placeholder.svg"}
          width={300}
          height={300}
          alt="Image Preview"
          className="drop-shadow-xl"
        />

        {/* <div className="sr-only">
          <h2>Features:</h2>
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="flex space-x-4 align-middle items-center"
            >
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
            type="button"
            className="mt-4"
            onClick={() => append({ name: "", value: "" })}
          >
            Add Feature
          </Button>
        </div> */}

        <Button className="bg-primary" type="submit">
          Submit
        </Button>
      </form>
      <Button onClick={() => form.reset()} className="mt-4 bg-red-900">
        Reset Form
      </Button>
    </Form>
  );
}
