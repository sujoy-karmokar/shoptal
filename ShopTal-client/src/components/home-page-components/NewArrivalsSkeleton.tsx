import { Card, CardContent, CardFooter } from "../shadcn-ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn-ui/carousel";
import { Skeleton } from "../shadcn-ui/skeleton";

export default function NewArrivalsSkeleton() {
  return (
    <section className="mb-12">
      <Skeleton className="h-10 w-56 mb-6" />
      <Carousel>
        <CarouselContent>
          {[...Array(4)].map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card>
                <CardContent className="p-4">
                  <Skeleton className="w-full h-[200px] rounded-md" />
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <Skeleton className="h-10 w-full mt-2" />
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
