"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/shadcn-ui/textarea";
import { StarRatingInput } from "./StarRatingInput";

const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, "Rating is required")
    .max(5, "Rating must be 5 or less"),
  comment: z.string().min(10, "Comment must be at least 10 characters long"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void;
  initialData?: ReviewFormData;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export function ReviewForm({
  onSubmit,
  initialData,
  isEditing = false,
  onCancelEdit,
}: ReviewFormProps) {
  const form = useForm<ReviewFormData, any, ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialData || { rating: 0, comment: "" },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({ rating: 0, comment: "" });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rating</FormLabel>
              <FormControl>
                <StarRatingInput
                  initialRating={field.value}
                  onRatingChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts on the product..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" className="w-full md:w-auto">
            {isEditing ? "Update Review" : "Submit Review"}
          </Button>
          {isEditing && onCancelEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
