"use client";

import ContentLayout from "@/components/dashboard-page-components/ContentLayout";
import { CouponForm } from "@/components/dashboard-page-components/coupons-page-components/CouponForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/shadcn-ui/breadcrumb";
import { createCoupon } from "@/lib/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewCouponPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to create a coupon.");
      return;
    }
    setIsLoading(true);
    try {
      await createCoupon(
        {
          ...data,
          expirationDate: new Date(data.expirationDate).toISOString(),
          discountValue: Number(data.discountValue),
          usageLimit: Number(data.usageLimit),
        },
        session.user.accessToken
      );
      toast.success("Coupon created successfully!");
      router.push("/dashboard/coupons");
    } catch (error: any) {
      toast.error(error.message || "Failed to create coupon.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentLayout title="New">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/coupons">Coupons</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CouponForm onSubmit={handleSubmit} isLoading={isLoading} />
    </ContentLayout>
  );
}
