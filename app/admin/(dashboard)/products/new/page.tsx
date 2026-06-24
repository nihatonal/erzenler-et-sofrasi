import { ProductForm } from "@/components/admin/products/ProductForm";
import { createProductAction } from "../actions";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

export default async function NewProductPage() {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const [categoriesResult, settingsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name_tr")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),

    supabase
      .from("restaurant_settings")
      .select("enabled_locales")
      .eq("restaurant_id", restaurantId)
      .single(),
  ]);

  const enabledLocales = settingsResult.data?.enabled_locales || [
    "tr",
    "en",
    "ru",
    "ar",
  ];

  return (
    <>
      <main className="p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-green">Yeni Ürün</h1>
          <p className="mt-2 text-sm text-brand-muted">
            Menüye yeni bir ürün ekleyin.
          </p>
        </div>

        <ProductForm
          mode="create"
          categories={categoriesResult.data || []}
          enabledLocales={enabledLocales}
          action={createProductAction}
        />
      </main>
    </>
  );
}
