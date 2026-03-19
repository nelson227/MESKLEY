import type { Metadata } from "next";
import AdminSidebar from "@/components/layout/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin MESKLEY LOCATION" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-4 pt-16 lg:pt-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
