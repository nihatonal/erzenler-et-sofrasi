import { AdminDashboardStats } from "@/components/admin/dashboard/AdminDashboardStats";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const { restaurantId } = await getAdminRestaurant();

  return (
    <main className="p-6 lg:p-10">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Yönetim Paneli</h1>

        <p className="mt-2 text-brand-muted">
          Siparişleri, ürünleri ve restoran ayarlarını buradan yönetin.
        </p>
      </div>

      <AdminDashboardStats restaurantId={restaurantId} />
    </main>
  );
}