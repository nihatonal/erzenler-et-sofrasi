import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createProductOptionAction,
  deleteProductOptionAction,
} from "@/app/admin/(dashboard)/products/actions";
import { ProductOptionsPanel } from "./ProductOptionsPanel";

type ProductOptionsSectionProps = {
  productId: string;
  restaurantId: string;
};

export async function ProductOptionsSection({
  productId,
  restaurantId,
}: ProductOptionsSectionProps) {
  const supabase = await createSupabaseServerClient();

  const { data: options } = await supabase
    .from("product_options")
    .select(
      `
      id,
      option_group,
      name_tr,
      name_en,
      name_ru,
      name_ar,
      price_difference_try,
      sort_order,
      is_active
    `
    )
    .eq("product_id", productId)
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true });

  return (
    <ProductOptionsPanel
      productId={productId}
      options={options || []}
      createAction={createProductOptionAction}
      deleteAction={deleteProductOptionAction}
    />
  );
}