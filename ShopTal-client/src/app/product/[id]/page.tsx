import { fetchAPI, getMyOrders } from "@/lib/api";
import { Order, Product } from "@/types";
import { ProductReviews } from "@/components/product-page-components/ProductReviews";
import ProductPageLayout from "@/components/product-page-components/ProductPageLayout";
import { auth } from "@/auth";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string): Promise<Product> {
  const product = await fetchAPI<{ data: Product }>(`/products/${id}`);
  return product.data;
}

async function checkReviewEligibility(productId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return false;
  }

  try {
    const orders = await getMyOrders(session.user.accessToken);
    return orders.some(
      (order: Order) =>
        order.status === "DELIVERED" &&
        order.orderItems.some((item) => item.productId === productId)
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return false;
  }
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const product = await getProduct(params.id);
  const canReview = await checkReviewEligibility(params.id);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <ProductPageLayout product={product}>
      <ProductReviews
        productId={product.id}
        initialAverageRating={product.averageRating}
        canReview={canReview}
      />
    </ProductPageLayout>
  );
}
