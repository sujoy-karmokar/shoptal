"use client";

import { Home, Search, ShoppingCart, User, Grid3X3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import MobileCategoryBrowser from "./MobileCategoryBrowser";

interface Brand {
  brandId: string;
  categoryId: string;
  brand: {
    id: string;
    name: string;
  };
}

interface ProductSubcategory {
  id: string;
  name: string;
  categoryId?: string;
}

interface NavbarCategory {
  id: string;
  name: string;
  productSubcategory: ProductSubcategory[];
  brands: Brand[];
}

interface BottomNavigationProps {
  categories?: NavbarCategory[];
}

export default function BottomNavigation({ categories = [] }: BottomNavigationProps) {
  const pathname = usePathname();
  const { status } = useSession();
  const [showCategories, setShowCategories] = useState(false);

  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
      isLink: true,
    },
    {
      name: "Categories",
      href: "#",
      icon: Grid3X3,
      active: showCategories,
      isLink: false,
      onClick: () => setShowCategories(true),
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
      active: pathname === "/search",
      isLink: true,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      active: pathname === "/cart",
      isLink: true,
    },
    {
      name: "Profile",
      href: status === "authenticated" ? "/profile" : "/login",
      icon: User,
      active: pathname === "/profile" || pathname === "/login",
      isLink: true,
    },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-pink-100 shadow-lg">
        <div className="flex items-center justify-around py-2 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const baseClasses = `flex flex-col items-center justify-center min-w-[50px] py-2 px-2 rounded-lg transition-all duration-200 ${
              item.active
                ? "text-pink-600 bg-pink-50"
                : "text-gray-600 hover:text-pink-600 hover:bg-pink-25"
            }`;

            if (item.isLink) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={baseClasses}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            } else {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={baseClasses}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            }
          })}
        </div>
      </div>

      {/* Mobile Category Browser */}
      <MobileCategoryBrowser
        categories={categories}
        open={showCategories}
        onOpenChange={setShowCategories}
      />
    </>
  );
}