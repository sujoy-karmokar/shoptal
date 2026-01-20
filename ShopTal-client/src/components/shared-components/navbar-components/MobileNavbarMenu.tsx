"use client";

import { Button } from "@/components/shadcn-ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn-ui/sheet";
import { LogIn, Menu, ShoppingCart, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn-ui/accordion";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

interface Category {
  id: string;
  name: string;
  productSubcategory: ProductSubcategory[];
  brands: Brand[];
}

export default function MobileNavbarMenu({
  categories,
}: {
  categories: Category[];
}) {
  const { status } = useSession();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden min-w-[44px] min-h-[44px] p-3">
          <Menu className="h-5 w-5 text-primary" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="overflow-y-auto z-70 p-0 bg-white border-r border-pink-100 min-w-[280px] max-w-sm"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-pink-50">
          <SheetTitle>
            <SheetClose asChild>
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl text-primary">ShopTal</span>
              </Link>
            </SheetClose>
          </SheetTitle>
          <SheetDescription className="text-left text-sm text-gray-600 mt-1">
            Discover amazing products
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 py-4 space-y-2">
          {status === "unauthenticated" ? (
            <SheetClose asChild>
              <Link
                href="/login"
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-pink-50 transition-colors duration-200"
                aria-label="Login"
              >
                <LogIn className="h-5 w-5 text-pink-600" />
                <span className="font-medium text-gray-700">Login</span>
              </Link>
            </SheetClose>
          ) : (
            <>
              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-pink-50 transition-colors duration-200"
                  aria-label="User Account"
                >
                  <User className="h-5 w-5 text-pink-600" />
                  <span className="font-medium text-gray-700">Profile</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/cart"
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-pink-50 transition-colors duration-200"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="h-5 w-5 text-pink-600" />
                  <span className="font-medium text-gray-700">Cart</span>
                </Link>
              </SheetClose>
            </>
          )}
        </div>
        <div className="px-6 py-3 border-t border-pink-50">
          <SheetDescription className="text-left text-sm font-medium text-gray-700 mb-3">
            Browse Categories
          </SheetDescription>
        </div>
        <Accordion type="single" collapsible className="w-full px-4">
          {categories.map((category: Category) => (
            <AccordionItem
              key={category.id}
              value={`category-${category.id}`}
              className="border-b border-pink-50"
            >
              <AccordionTrigger className="text-sm font-semibold text-primary hover:text-pink-600 px-3 py-3 rounded-lg hover:bg-pink-25 transition-colors duration-200">
                <SheetClose asChild>
                  <Link
                    href={`/search?categoryId=${category.id}`}
                    className="w-full text-left"
                  >
                    {category.name}
                  </Link>
                </SheetClose>
              </AccordionTrigger>
              <AccordionContent className="pl-6 pb-3">
                <Accordion type="multiple" defaultValue={[]}>
                  {category.productSubcategory.length > 0 && (
                    <AccordionItem
                      value="subcategories"
                      className="border-none"
                    >
                      <AccordionTrigger className="text-xs font-medium text-gray-600 hover:text-pink-600 px-2 py-2 rounded-md hover:bg-pink-25 transition-colors duration-200">
                        Subcategories
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 mt-2">
                          {category.productSubcategory.map((subcategory) => (
                            <li key={subcategory.id}>
                              <SheetClose asChild>
                                <Link
                                  href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
                                  className="block px-3 py-2 hover:bg-pink-50 rounded-md text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                  {subcategory.name}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {category.brands.length > 0 && (
                    <AccordionItem value="brands" className="border-none">
                      <AccordionTrigger className="text-xs font-medium text-gray-600 hover:text-pink-600 px-2 py-2 rounded-md hover:bg-pink-25 transition-colors duration-200">
                        Brands
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 mt-2">
                          {category.brands.map((brandItem) => (
                            <li key={brandItem.brand.id}>
                              <SheetClose asChild>
                                <Link
                                  href={`/search?categoryId=${brandItem.categoryId}&brandId=${brandItem.brand.id}`}
                                  className="block px-3 py-2 hover:bg-pink-50 rounded-md text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                  {brandItem.brand.name}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
