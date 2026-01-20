import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/shadcn-ui/sonner";
import Navbar from "@/components/shared-components/navbar-components/Navbar";
import Header from "@/components/shared-components/navbar-components/Header";
import Footer from "@/components/shared-components/Footer";
import MobileCategoryBrowser from "@/components/shared-components/navbar-components/MobileCategoryBrowser";
import BottomNavigation from "@/components/shared-components/navbar-components/BottomNavigation";
import NextAuthProvider from "@/components/shared-components/NextAuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fetchCategories } from "@/lib/api";
import { NavbarCategory } from "@/components/shared-components/navbar-components/MobileNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopTal - Your Ultimate Shopping Destination",
  description:
    "Discover amazing products at ShopTal. Shop the latest trends, new arrivals, and exclusive deals on fashion, electronics, home goods, and more. Fast shipping, secure payments, and exceptional customer service.",
  keywords:
    "shopping, online store, fashion, electronics, home goods, deals, new arrivals, e-commerce",
  authors: [{ name: "ShopTal Team" }],
  creator: "ShopTal",
  publisher: "ShopTal",
  openGraph: {
    title: "ShopTal - Your Ultimate Shopping Destination",
    description:
      "Discover amazing products at ShopTal. Shop the latest trends, new arrivals, and exclusive deals.",
    url: "https://shoptal.com",
    siteName: "ShopTal",
    images: [
      {
        url: "/images/blackfriday.webp",
        width: 1200,
        height: 630,
        alt: "ShopTal - Amazing Products and Deals",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopTal - Your Ultimate Shopping Destination",
    description:
      "Discover amazing products at ShopTal. Shop the latest trends, new arrivals, and exclusive deals.",
    images: ["/images/blackfriday.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories: NavbarCategory[] = await fetchCategories();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="dns-prefetch" href="http://res.cloudinary.com" />
      </head>
      <body className={`bg-gray-100 ${inter.className}`}>
        <div className="overflow-hidden whitespace-nowrap bg-gray-100 py-0.5">
          <p
            className="inline-block font-light"
            style={{
              animation: "marquee 15s linear infinite",
              display: "inline-block",
            }}
          >
            🔧 Found something broken or not working as expected? I&apos;d love
            to hear from you! Please share your feedback via{" "}
            <a
              href="https://linkedin.com/in/dipto-karmaker/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              my LinkedIn.
            </a>
          </p>

          <style>
            {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
          </style>
        </div>

        <NextAuthProvider>
          <Header>
            <MobileCategoryBrowser categories={categories} />
          </Header>
          <Navbar />
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNavigation categories={categories} />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </NextAuthProvider>
      </body>
    </html>
  );
}
