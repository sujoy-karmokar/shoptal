import { Card, CardContent, CardFooter } from "../shadcn-ui/card";
import { Skeleton } from "../shadcn-ui/skeleton";

export default function RandomProductsSkeleton() {
  return (
    <section>
      <Skeleton className="h-10 w-56 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <Skeleton className="w-full h-[200px] rounded-md" />
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
