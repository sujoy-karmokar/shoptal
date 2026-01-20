import AdminPanelLayout from "@/components/dashboard-page-components/AdminPanelLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShopTal - Dashboard",
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
