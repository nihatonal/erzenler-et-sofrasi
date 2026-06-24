import { AdminCategoriesClient } from "@/components/admin/categories/AdminCategoriesClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type LocaleCode = "tr" | "en" | "ru" | "ar";

export default async function AdminCategoriesPage() {
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  if (!restaurantId) {
    throw new Error("NEXT_PUBLIC_RESTAURANT_ID env eksik.");
  }

  const supabase = await createSupabaseServerClient();

  const { data: settings } = await supabase
    .from("restaurant_settings")
    .select("enabled_locales")
    .eq("restaurant_id", restaurantId)
    .single();

  const enabledLocales = (settings?.enabled_locales || [
    "tr",
    "en",
    "ru",
    "ar",
  ]) as LocaleCode[];

  return (
    <main className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-green">Kategoriler</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Menü kategorilerini buradan yönetin.
        </p>
      </div>

      <AdminCategoriesClient
        restaurantId={restaurantId}
        enabledLocales={enabledLocales}
      />
    </main>
  );
}