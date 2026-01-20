"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Loader2 } from "lucide-react";

export default function AnalyticsDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<any>(null);
  const [productPerf, setProductPerf] = useState<any[]>([]);
  const [cartAbandon, setCartAbandon] = useState<number | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!session?.user?.accessToken) return;
      try {
        const headers = { Authorization: `Bearer ${session.user.accessToken}` };
        const [countsRes, perfRes, abandonRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/counts`, {
            headers,
          }),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/analytics/products/performance`,
            { headers }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/analytics/carts/abandonment-rate`,
            { headers }
          ),
        ]);
        setCounts((await countsRes.json()).data);
        setProductPerf((await perfRes.json()).data);
        setCartAbandon((await abandonRes.json()).data);
      } catch (e) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [session]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {counts &&
          Object.entries(counts).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{key.replace(/Counts$/, " Count")}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">{String(value)}</span>
              </CardContent>
            </Card>
          ))}
        {cartAbandon !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Cart Abandonment Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {cartAbandon.toFixed(2)}%
              </span>
            </CardContent>
          </Card>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Product Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Quantity</th>
                <th className="border px-2 py-1">In Carts</th>
              </tr>
            </thead>
            <tbody>
              {productPerf.map((p: any) => (
                <tr key={p.id}>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1">{p.quantity}</td>
                  <td className="border px-2 py-1">{p.cartItemsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
