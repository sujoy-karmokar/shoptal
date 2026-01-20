import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { RouteConfig } from "./types";

// Define protected routes and their required roles
export const PROTECTED_ROUTES: RouteConfig = {
  "/dashboard": ["admin"],
  "/cart": ["user", "admin"],
  "/profile": ["user", "admin"],
};

// Define authentication-related routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  UNAUTHORIZED: "/unauthorized", // A dedicated page for authorization errors
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const userRole = user?.role ?? "";

  const protectedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (protectedRoute) {
    // If the user is not authenticated, redirect to the login page
    if (!user) {
      const loginUrl = new URL(AUTH_ROUTES.LOGIN, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if the user has the required role for the route
    const allowedRoles = PROTECTED_ROUTES[protectedRoute];
    if (!allowedRoles.includes(userRole)) {
      // Redirect to the login page if the role does not match
      return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN, req.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
