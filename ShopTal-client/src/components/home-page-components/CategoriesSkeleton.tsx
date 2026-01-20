import { Skeleton } from "../shadcn-ui/skeleton";

export default function CategoriesSkeleton() {
  return (
    <section className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="text-center sm:text-left">
          <Skeleton className="h-8 w-48 mx-auto sm:mx-0 mb-2" />
          <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
        </div>
        <Skeleton className="h-10 w-40 self-center sm:self-auto" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white rounded-xl border border-pink-100 shadow-sm w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 mx-auto animate-pulse"
          >
            <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 rounded-full mb-3" />
            <Skeleton className="h-4 w-16 sm:w-20" />
          </div>
        ))}
      </div>
    </section>
  );
}
