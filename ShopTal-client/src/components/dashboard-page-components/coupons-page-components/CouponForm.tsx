"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Loader2 } from "lucide-react";
import { Coupon } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";

const couponFormSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
    required_error: "Discount type is required",
  }),
  discountValue: z.coerce
    .number()
    .min(0, "Discount value must be non-negative"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  usageLimit: z.coerce.number().min(1, "Usage limit must be at least 1"),
});

type CouponFormData = z.infer<typeof couponFormSchema>;

interface CouponFormProps {
  initialData?: Coupon; // For editing existing coupons
  onSubmit: (data: CouponFormData) => Promise<void>;
  isLoading: boolean;
}

export function CouponForm({
  initialData,
  onSubmit,
  isLoading,
}: CouponFormProps) {
  const form = useForm<CouponFormData, any, CouponFormData>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: initialData?.code || "",
      discountType: initialData?.discountType || "PERCENTAGE",
      discountValue: initialData?.discountValue || 0,
      expirationDate: initialData?.expirationDate
        ? new Date(initialData.expirationDate).toISOString().split("T")[0]
        : "",
      usageLimit: initialData?.usageLimit || 1,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input placeholder="SUMMER20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a discount type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discountValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 10 for 10% or $10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Limit</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {initialData ? "Update Coupon" : "Create Coupon"}
        </Button>
      </form>
    </Form>
  );
}
