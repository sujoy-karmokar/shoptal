import { NavbarCategory } from "@/components/shared-components/navbar-components/MobileNavbar";
import {
  Product,
  Category,
  PaginatedResponse,
  SearchParams,
  Coupon,
  Review,
  Order,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string>,
  accessToken?: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res?.statusText || ""}`);
  }
  return res.json();
}

export const getCategories = (params: any) =>
  fetchAPI<PaginatedResponse<Category>>("/categories", {
    ...params,
  });

export const searchProducts = (params: SearchParams) =>
  fetchAPI<PaginatedResponse<Product>>("/products", {
    searchTerm: params.searchTerm || "",
    category: params.category || "",
    minPrice: params.minPrice?.toString() || "",
    maxPrice: params.maxPrice?.toString() || "",
    page: params.page?.toString() || "1",
    limit: params.limit?.toString() || "10",
    categoryId: params.categoryId || "",
    subcategoryId: params.subcategoryId || "",
    brandId: params.brandId || "",
  });

export async function fetchCategories(): Promise<NavbarCategory[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_BASE_URL}/categories/navbar-category`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createOrderAPI<T>(
  endpoint: string,
  payload: any,
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}

export async function applyCouponAPI<T>(
  endpoint: string,
  payload: { couponCode: string; totalAmount: number },
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}

export const getProductReviews = (
  productId: string,
  page: number = 1,
  limit: number = 5
) =>
  fetchAPI<PaginatedResponse<Review>>(`/reviews/${productId}`, {
    page: String(page),
    limit: String(limit),
  });

export async function createReview(
  payload: {
    productId: string;
    rating: number;
    comment?: string;
  },
  accessToken: string
): Promise<Review> {
  const url = new URL(`${API_BASE_URL}/reviews`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  const responseData = await res.json();
  return responseData.data;
}

export async function updateReview(
  reviewId: string,
  payload: {
    rating?: number;
    comment?: string;
  },
  accessToken: string
): Promise<Review> {
  const url = new URL(`${API_BASE_URL}/reviews/${reviewId}`);

  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  const responseData = await res.json();
  return responseData.data;
}

export async function createCoupon<T>(
  payload: {
    code: string;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue: number;
    expirationDate: string;
    usageLimit: number;
  },
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}/coupons`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}

export const getOrders = (accessToken: string) =>
  fetchAPI("/orders/my", {}, accessToken);

export const getMyOrders = async (accessToken: string): Promise<Order[]> => {
  const response = await fetchAPI<{ data: Order[] }>(
    "/orders/my",
    {},
    accessToken
  );
  return response.data;
};

export const getOrderById = (orderId: string, accessToken: string) =>
  fetchAPI(`/orders/${orderId}`, {}, accessToken);

export async function updateOrderStatus<T>(
  orderId: string,
  status: string,
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}/orders/${orderId}`);

  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}

export const getCouponsAPI = (accessToken: string) =>
  fetchAPI<PaginatedResponse<Coupon>>("/coupons", {}, accessToken);

export const getCouponByIdAPI = (id: string, accessToken: string) =>
  fetchAPI<Coupon>(`/coupons/${id}`, {}, accessToken);

export async function updateCouponAPI<T>(
  id: string,
  payload: Partial<Coupon>,
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}/coupons/${id}`);

  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}

export async function deleteCouponAPI<T>(
  id: string,
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}/coupons/${id}`);

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}

export const getProductPerformanceAPI = (accessToken: string) =>
  fetchAPI<any>("/analytics/products/performance", {}, accessToken);

export const getCartsAbandonmentRateAPI = (accessToken: string) =>
  fetchAPI<any>("/analytics/carts/abandonment-rate", {}, accessToken);

export async function createPaymentIntentAPI(
  amount: number,
  accessToken: string
): Promise<{ data: { clientSecret: string } }> {
  const url = new URL(`${API_BASE_URL}/payment/create-payment-intent`);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }
  return res.json();
}
