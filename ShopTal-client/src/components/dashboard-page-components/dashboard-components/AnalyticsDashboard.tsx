"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn-ui/card";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import {
  Users,
  ShoppingBag,
  Tags,
  Layers,
  Award,
  TrendingUp,
  Percent,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadcn-ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  getCartsAbandonmentRateAPI,
  getProductPerformanceAPI,
} from "@/lib/api";

interface AnalyticsData {
  userCounts: number;
  productCounts: number;
  categoryCounts: number;
  subcategoryCounts: number;
  brandCounts: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  quantity: number;
  cartItemsCount: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [productPerformance, setProductPerformance] = useState<
    ProductPerformance[]
  >([]);
  const [abandonmentRate, setAbandonmentRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const { data: session, status } = useSession();

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenWidth(window.innerWidth);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    const fetchData = async (accessToken: string) => {
      try {
        const [countsRes, productPerfRes, abandonmentRateRes] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/counts`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            getProductPerformanceAPI(accessToken),
            getCartsAbandonmentRateAPI(accessToken),
          ]);

        if (!countsRes.ok) throw new Error("Failed to fetch counts data");
        const countsJson = await countsRes.json();
        setData(countsJson.data);

        setProductPerformance(productPerfRes.data);
        setAbandonmentRate(abandonmentRateRes.data);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error("Error fetching analytics data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.accessToken) {
      fetchData(session.user.accessToken as string);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setError("Authentication required to load analytics data.");
    }
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [session, status]);

  const cards = [
    {
      title: "Total Users",
      value: data?.userCounts,
      icon: Users,
      description: "Active users in the platform",
      color:
        "bg-gradient-to-tr from-blue-50/80 to-white dark:from-blue-950/60 dark:to-gray-900/80",
    },
    {
      title: "Total Products",
      value: data?.productCounts,
      icon: ShoppingBag,
      description: "Products listed in store",
      color:
        "bg-gradient-to-tr from-green-50/80 to-white dark:from-green-950/60 dark:to-gray-900/80",
    },
    {
      title: "Categories",
      value: data?.categoryCounts,
      icon: Tags,
      description: "Main product categories",
      color:
        "bg-gradient-to-tr from-purple-50/80 to-white dark:from-purple-950/60 dark:to-gray-900/80",
    },
    {
      title: "Subcategories",
      value: data?.subcategoryCounts,
      icon: Layers,
      description: "Product subcategories",
      color:
        "bg-gradient-to-tr from-orange-50/80 to-white dark:from-orange-950/60 dark:to-gray-900/80",
    },
    {
      title: "Brands",
      value: data?.brandCounts,
      icon: Award,
      description: "Registered brands",
      color:
        "bg-gradient-to-tr from-pink-50/80 to-white dark:from-pink-950/60 dark:to-gray-900/80",
    },
    {
      title: "Cart Abandonment Rate",
      value:
        abandonmentRate !== null ? `${abandonmentRate.toFixed(2)}%` : "N/A",
      icon: Percent,
      description: "Percentage of abandoned carts",
      color:
        "bg-gradient-to-tr from-red-50/80 to-white dark:from-red-950/60 dark:to-gray-900/80",
    },
  ];

  const chartData = data
    ? [
        { name: "Users", value: data.userCounts },
        { name: "Products", value: data.productCounts },
        { name: "Categories", value: data.categoryCounts },
        { name: "Subcategories", value: data.subcategoryCounts },
        { name: "Brands", value: data.brandCounts },
      ]
    : [];

  const productPerformanceChartData = productPerformance.map((p) => ({
    name: p.name,
    "Cart Items": p.cartItemsCount,
    Quantity: p.quantity,
  }));

  const getChartHeight = () => {
    if (screenWidth < 640) {
      return "h-[220px]";
    } else if (screenWidth < 1024) {
      return "h-[260px]";
    } else {
      return "h-[300px]";
    }
  };
  const chartHeightClass = getChartHeight();
  const getChartConfig = () => {
    if (screenWidth < 640) {
      return {
        height: 220,
        margin: { top: 8, right: 8, left: 8, bottom: 32 },
        xAxisAngle: -90,
        xAxisHeight: 32,
        xAxisFontSize: 8,
        yAxisFontSize: 8,
      };
    } else if (screenWidth < 1024) {
      return {
        height: 260,
        margin: { top: 12, right: 12, left: 12, bottom: 40 },
        xAxisAngle: -45,
        xAxisHeight: 40,
        xAxisFontSize: 10,
        yAxisFontSize: 10,
      };
    } else {
      return {
        height: 300,
        margin: { top: 16, right: 16, left: 16, bottom: 48 },
        xAxisAngle: -45,
        xAxisHeight: 48,
        xAxisFontSize: 12,
        yAxisFontSize: 12,
      };
    }
  };
  const chartConfig = getChartConfig();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-2 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="mb-2 sm:mb-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Key metrics at a glance
            </p>
          </div>
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary/70" />
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-6" />
        {error ? (
          <div className="rounded-md bg-red-50 dark:bg-red-900/10 p-2 text-center text-xs text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 max-w-md mx-auto">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fadein">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
              {cards.map((card, index) => (
                <Card
                  key={index}
                  className={`border border-gray-100 dark:border-gray-800 shadow-none hover:shadow-md transition-all duration-200 ${card.color} rounded-lg p-2 sm:p-3 min-h-[90px] flex flex-col justify-between animate-fadein`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-0">
                    <CardTitle className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-200">
                      {card.title}
                    </CardTitle>
                    <div className="p-1 rounded-full bg-white/70 dark:bg-gray-900/60">
                      <card.icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    {isLoading ? (
                      <Skeleton className="h-5 sm:h-6 w-12 sm:w-16" />
                    ) : (
                      <>
                        <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          {card.value?.toLocaleString()}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {card.description}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
            <Card className="w-full border border-gray-100 dark:border-gray-800 shadow-none bg-gradient-to-tr from-gray-50/80 to-white dark:from-gray-900/60 dark:to-gray-950/80 animate-fadein">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Analytics Overview
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Comparative view of all metrics
                </CardDescription>
              </CardHeader>
              <CardContent className={`pt-2 ${chartHeightClass}`}>
                {isLoading ? (
                  <Skeleton
                    className={`${chartHeightClass} w-full rounded-md`}
                  />
                ) : (
                  <ChartContainer
                    config={{ value: { label: "Count" } }}
                    className={`w-full h-full`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={chartConfig.margin}>
                        <CartesianGrid
                          vertical={false}
                          stroke="#f3f4f6"
                          strokeDasharray="2 2"
                        />
                        <XAxis
                          dataKey="name"
                          angle={chartConfig.xAxisAngle}
                          textAnchor="end"
                          height={chartConfig.xAxisHeight}
                          interval={0}
                          tick={{
                            fontSize: chartConfig.xAxisFontSize,
                            fill: "#888",
                            opacity: 0.7,
                          }}
                          strokeOpacity={0.3}
                        />
                        <YAxis
                          stroke="#888"
                          strokeOpacity={0.3}
                          tick={{
                            fontSize: chartConfig.yAxisFontSize,
                            fill: "#888",
                            opacity: 0.7,
                          }}
                        />
                        <Bar
                          dataKey="value"
                          radius={[3, 3, 0, 0]}
                          fill="var(--primary)"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Product Performance Chart */}
            {productPerformance.length > 0 && (
              <Card className="w-full border border-gray-100 dark:border-gray-800 shadow-none bg-gradient-to-tr from-gray-50/80 to-white dark:from-gray-900/60 dark:to-gray-950/80 animate-fadein">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Product Performance
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Products by quantity and cart items count
                  </CardDescription>
                </CardHeader>
                <CardContent className={`pt-2 ${chartHeightClass}`}>
                  {isLoading ? (
                    <Skeleton
                      className={`${chartHeightClass} w-full rounded-md`}
                    />
                  ) : (
                    <ChartContainer
                      config={{
                        "Cart Items": {
                          label: "Cart Items",
                          color: "hsl(var(--chart-1))",
                        },
                        Quantity: {
                          label: "Quantity",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className={`w-full h-full`}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productPerformanceChartData}
                          margin={chartConfig.margin}
                        >
                          <CartesianGrid
                            vertical={false}
                            stroke="#f3f4f6"
                            strokeDasharray="2 2"
                          />
                          <XAxis
                            dataKey="name"
                            angle={chartConfig.xAxisAngle}
                            textAnchor="end"
                            height={chartConfig.xAxisHeight}
                            interval={0}
                            tick={{
                              fontSize: chartConfig.xAxisFontSize,
                              fill: "#888",
                              opacity: 0.7,
                            }}
                            strokeOpacity={0.3}
                          />
                          <YAxis
                            stroke="#888"
                            strokeOpacity={0.3}
                            tick={{
                              fontSize: chartConfig.yAxisFontSize,
                              fill: "#888",
                              opacity: 0.7,
                            }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="Cart Items"
                            fill="var(--color-Cart-Items)"
                            radius={[3, 3, 0, 0]}
                          />
                          <Bar
                            dataKey="Quantity"
                            fill="var(--color-Quantity)"
                            radius={[3, 3, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
