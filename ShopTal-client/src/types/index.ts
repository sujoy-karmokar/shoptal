export interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  expirationDate: string;
  usageLimit: number;
  used: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    image?: string;
    id: string;
  };
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description: string;
  features: { name: string; value: string }[];
  category?: { name: string };
  reviews?: Review[];
  averageRating: number;
  _count?: {
    reviews?: number;
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  orderItems: OrderItem[];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: T[];
  };
}

export interface SearchParams {
  searchTerm?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  limit?: number;
}

export interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    role: string;
  };
}

export interface AuthData {
  accessToken: string;
  role: string;
  passwordChangeRequired?: boolean;
}

export interface RouteConfig {
  [path: string]: string[];
}

export interface RedirectOptions {
  passwordChangeRequired?: boolean;
  redirect?: string;
}
