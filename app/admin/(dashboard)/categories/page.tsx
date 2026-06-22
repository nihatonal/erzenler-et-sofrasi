import { AdminCategoriesClient } from "@/components/admin/categories/AdminCategoriesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function AdminCategoriesPage() {
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  if (!restaurantId) {
    throw new Error("NEXT_PUBLIC_RESTAURANT_ID env eksik.");
  }

  return (
    <main className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-green">Kategoriler</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Menü kategorilerini buradan yönetin.
        </p>
      </div>

      <AdminCategoriesClient restaurantId={restaurantId} />
    </main>
  );
}