import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Card, CardContent } from "@/components/shadcn-ui/card";

export default function CategoriesGridSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="relative">
            <Skeleton className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Skeleton className="h-10 w-full sm:w-64 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Categories Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(20)].map((_, index) => (
          <Card
            key={index}
            className="h-full overflow-hidden border border-gray-200 bg-white"
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon Skeleton */}
                <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" />

                {/* Content Skeleton */}
                <div className="space-y-2 w-full">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
