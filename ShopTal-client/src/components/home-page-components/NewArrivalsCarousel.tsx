"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn-ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { EnhancedProductCard } from "../shared-components/EnhancedProductCard";
import { Product } from "@/types";

export default function NewArrivalsCarousel(newArrivals: {
  newArrivals: Product[];
}) {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      opts={{
        align: "start",
        dragFree: true,
        containScroll: "trimSnaps",
      }}
      className="relative mt-10"
    >
      <div className="block md:hidden absolute -top-6 right-12 z-10">
        <CarouselPrevious className="h-8 w-8 bg-white/90 hover:bg-white border border-pink-200 shadow-md" />
        <CarouselNext className="h-8 w-8 bg-white/90 hover:bg-white border border-pink-200 shadow-md ml-2" />
      </div>
      <CarouselContent className="overflow-visible -ml-3">
        {newArrivals?.newArrivals?.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6 pl-3"
          >
            <div className="h-full flex">
              <EnhancedProductCard
                product={product}
                variant="compact"
                showQuickActions={false}
                priority={false}
                className="min-w-80 md:min-w-0"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
