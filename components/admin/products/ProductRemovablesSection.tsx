import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createProductRemovableAction,
  deleteProductRemovableAction,
} from "@/app/admin/(dashboard)/products/actions";
import { ProductRemovablesPanel } from "./ProductRemovablesPanel";

type ProductRemovablesSectionProps = {
  productId: string;
  restaurantId: string;
};

export async function ProductRemovablesSection({
  productId,
  restaurantId,
}: ProductRemovablesSectionProps) {
  const supabase = await createSupabaseServerClient();

  const { data: removables } = await supabase
    .from("product_removables")
    .select(
      `
      id,
      name_tr,
      name_en,
      name_ru,
      name_ar,
      sort_order,
      is_active
    `,
    )
    .eq("product_id", productId)
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true });

  return (
    <ProductRemovablesPanel
      productId={productId}
      removables={removables || []}
      createAction={createProductRemovableAction}
      deleteAction={deleteProductRemovableAction}
    />
  );
}
