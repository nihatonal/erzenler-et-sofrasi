import { ProductForm } from "@/components/admin/products/ProductForm";
import { createProductAction } from "../actions";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

export default async function NewProductPage() {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name_tr")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

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
          categories={categories || []}
          action={createProductAction}
        />
      </main>
    </>
  );
}
