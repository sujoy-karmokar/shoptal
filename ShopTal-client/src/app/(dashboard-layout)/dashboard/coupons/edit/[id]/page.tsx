"use client";

import { CouponForm } from "@/components/dashboard-page-components/coupons-page-components/CouponForm";
import { getCouponByIdAPI, updateCouponAPI } from "@/lib/api";
import { Coupon } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ContentLayout from "@/components/dashboard-page-components/ContentLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/shadcn-ui/breadcrumb";
import Link from "next/link";

export default function EditCouponPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { data: session } = useSession();
  const router = useRouter();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { id } = params;

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!session?.user?.accessToken) return;
      setIsLoading(true);
      try {
        const res: any = await getCouponByIdAPI(id, session.user.accessToken);
        setCoupon(res.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch coupon.");
        router.push("/dashboard/coupons");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.accessToken) {
      fetchCoupon();
    }
  }, [id, session, router]);

  const handleSubmit = async (data: any) => {
    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to update a coupon.");
      return;
    }
    setIsUpdating(true);
    try {
      await updateCouponAPI(
        id,
        {
          ...data,
          expirationDate: new Date(data.expirationDate).toISOString(),
          discountValue: Number(data.discountValue),
          usageLimit: Number(data.usageLimit),
        },
        session.user.accessToken
      );
      toast.success("Coupon updated successfully!");
      router.push("/dashboard/coupons");
    } catch (error: any) {
      toast.error(error.message || "Failed to update coupon.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Coupon not found.
      </div>
    );
  }

  return (
    <ContentLayout title="Edit Coupon">
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
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CouponForm
        initialData={coupon}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </ContentLayout>
  );
}
