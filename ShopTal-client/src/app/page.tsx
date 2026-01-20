import { Suspense } from "react";
import Banner from "@/components/home-page-components/Banner";
import Categories from "@/components/home-page-components/Categories";
import CategoriesSkeleton from "@/components/home-page-components/CategoriesSkeleton";
import NewArrivals from "@/components/home-page-components/NewArrivals";
import NewArrivalsSkeleton from "@/components/home-page-components/NewArrivalsSkeleton";
import RandomProducts from "@/components/home-page-components/RandomProducts";
import RandomProductsSkeleton from "@/components/home-page-components/RandomProductsSkeleton";
import Features from "@/components/home-page-components/Features";
import Testimonials from "@/components/home-page-components/Testimonials";
import NewsletterSignup from "@/components/home-page-components/NewsletterSignup";

export default function HomePage() {
  return (
    <section className="container mx-auto px-4 py-8">
      <Banner />
      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<RandomProductsSkeleton />}>
        <RandomProducts />
      </Suspense>
      <Features />
      <Testimonials />
      <NewsletterSignup />
    </section>
  );
}
