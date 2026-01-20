"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/shadcn-ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn-ui/pagination";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { createReview, getProductReviews, updateReview } from "@/lib/api";
import { Review } from "@/types";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../shadcn-ui/avatar";
import { Separator } from "../shadcn-ui/separator";
import { Skeleton } from "../shadcn-ui/skeleton";
import { ReviewForm, ReviewFormData } from "./ReviewForm";

interface ProductReviewsProps {
  productId: string;
  canReview: boolean;
  initialAverageRating: number;
}

export function ProductReviews({
  productId,
  canReview,
  initialAverageRating,
}: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [initialReviewData, setInitialReviewData] =
    useState<ReviewFormData | null>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProductReviews(productId, currentPage);
      setReviews(response.data.data);
      setTotalReviews(response.data.meta.total);
      setTotalPages(
        Math.ceil(response.data.meta.total / response.data.meta.limit)
      );
      // Check if the current user has already reviewed this product
      if (session?.user?.userId) {
        const userReview = response.data.data.find(
          (review: Review) => review.userId === session.user.userId
        );
        setHasUserReviewed(!!userReview);
      }
    } catch (error) {
      toast.error("Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  }, [productId, currentPage, session?.user?.userId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    try {
      if (editingReviewId) {
        await updateReview(
          editingReviewId,
          {
            rating: data.rating,
            comment: data.comment,
          },
          session.user.accessToken
        );
        toast.success("Review updated successfully!");
        setEditingReviewId(null);
        setInitialReviewData(null);
      } else {
        if (!canReview) {
          toast.error("You can only review products that you have purchased.");
          return;
        }
        await createReview(
          {
            productId,
            rating: data.rating,
            comment: data.comment,
          },
          session.user.accessToken
        );
        toast.success("Review submitted successfully!");
        setHasUserReviewed(true); // Set to true after successful submission
      }

      // Refetch reviews to show the update/new review
      await fetchReviews();
      setCurrentPage(1); // Go back to the first page after submission/update
    } catch (error) {
      toast.error((error as Error).message || "Failed to submit review.");
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.id);
    setInitialReviewData({
      rating: review.rating,
      comment: review.comment || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setInitialReviewData(null);
  };

  return (
    <div className="mt-16">
      <Separator className="my-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating)
                      ? "text-primary"
                      : "text-muted-foreground/30"
                  }`}
                  fill="currentColor"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {(averageRating || 0).toFixed(1)} out of 5 ({totalReviews}{" "}
              reviews)
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          {/* Review Form */}
          {session?.user &&
            canReview &&
            !editingReviewId &&
            !hasUserReviewed && (
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-4">Write a review</h3>
                <ReviewForm onSubmit={onSubmit} />
              </div>
            )}
          {/* Display Reviews */}
          {isLoading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) =>
                editingReviewId === review.id ? (
                  <div key={review.id} className="mb-12">
                    <h3 className="text-xl font-bold mb-4">Edit your review</h3>
                    <ReviewForm
                      onSubmit={onSubmit}
                      initialData={initialReviewData || undefined}
                      isEditing
                      onCancelEdit={handleCancelEdit}
                    />
                  </div>
                ) : (
                  <div key={review?.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {review?.user.firstName} {review?.user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-primary"
                                  : "text-muted-foreground/30"
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {review?.comment}
                      </p>

                      {session?.user?.userId === review?.userId && (
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2"
                          onClick={() => handleEditClick(review)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.max(1, currentPage - 1));
                      }}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.min(totalPages, currentPage + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
