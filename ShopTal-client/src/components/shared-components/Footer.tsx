"use client";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CreditCard,
} from "lucide-react";
import { Input } from "../shadcn-ui/input";
import { Button } from "../shadcn-ui/button";
import { Separator } from "../shadcn-ui/separator";
import { usePathname } from "next/navigation";

export default function Footer() {
  const router = usePathname();
  const shouldHide = router.includes("/dashboard");
  if (shouldHide) return null;
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-primary mb-1">ShopTal</h2>
            <p className="text-xs leading-relaxed">
              Your Trusted Hub for Cutting-Edge Electronics
            </p>
            <div className="flex space-x-2 mt-2">
              <Link
                href="#"
                className="hover:text-pink-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="hover:text-pink-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="hover:text-pink-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="#" className="hover:underline">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Deals & Promotions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          {/* Customer Service */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Customer Service
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="#" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter SignUp */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Stay Updated
            </h3>
            <p className="mb-2 text-xs">
              Subscribe for exclusive deals and updates.
            </p>
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-background text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800"
              />
              <Button
                type="submit"
                className="text-xs px-3 py-1 rounded-md bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100"
                disabled
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
          <div className="text-xs">
            &copy; 2025 Dipto Karmaker. All rights reserved.
          </div>
          <div className="flex space-x-2">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
