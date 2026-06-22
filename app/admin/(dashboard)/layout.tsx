import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getAdminRestaurant();

  return <AdminShell>{children}</AdminShell>;
}