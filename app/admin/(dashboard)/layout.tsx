import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { restaurantId } = await getAdminRestaurant();

  return <AdminShell restaurantId={restaurantId}>{children}</AdminShell>;
}