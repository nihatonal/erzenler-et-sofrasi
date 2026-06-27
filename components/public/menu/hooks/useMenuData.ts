import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type {
  Category,
  Product,
  ProductOption,
  ProductRecommendation,
  ProductRemovable,
  RestaurantTable,
  Settings,
} from "../types";
import { wait } from "../utils";

type UseMenuDataProps = {
  restaurantId: string;
  tableSlug: string | null;
};

export function useMenuData({ restaurantId, tableSlug }: UseMenuDataProps) {
  const t = useTranslations("menu");

  const [settings, setSettings] = useState<Settings>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [table, setTable] = useState<RestaurantTable>(null);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [removables, setRemovables] = useState<ProductRemovable[]>([]);
  const [recommendations, setRecommendations] = useState<
    ProductRecommendation[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const loadMenuData = useCallback(async () => {
    setIsLoading(true);
    setErrorText("");

    const supabase = createSupabaseBrowserClient();

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const [
          settingsResult,
          categoriesResult,
          productsResult,
          tableResult,
          optionsResult,
          removablesResult,
          recommendationsResult,
        ] = await Promise.all([
          supabase
            .from("restaurant_settings")
            .select(
              `
              restaurant_name,
              restaurant_description,
              logo_url,
              phone,
              whatsapp,
              address,
              is_qr_ordering_enabled,
              is_online_ordering_enabled,
              delivery_fee_try,
              minimum_order_try,
              estimated_delivery_minutes,
              enabled_locales
            `,
            )
            .eq("restaurant_id", restaurantId)
            .single(),

          supabase
            .from("categories")
            .select("id, slug, name_tr, name_en, name_ru, name_ar, sort_order")
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),

          supabase
            .from("products")
            .select(
              `
              id,
              slug,
              category_id,
              sort_order,
              name_tr,
              name_en,
              name_ru,
              name_ar,
              description_tr,
              description_en,
              description_ru,
              description_ar,
              image_url,
              price_try,
              old_price_try,
              discount_percent,
              is_popular,
              is_recommended,
              is_new,
              is_discounted,
              is_vegetarian,
              is_vegan,
              is_gluten_free,
              is_spicy
            `,
            )
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true }),

          tableSlug
            ? supabase
                .from("restaurant_tables")
                .select("id, label, slug, qr_active, is_active")
                .eq("restaurant_id", restaurantId)
                .eq("slug", tableSlug)
                .maybeSingle()
            : Promise.resolve({ data: null, error: null }),

          supabase
            .from("product_options")
            .select(
              `
              id,
              product_id,
              option_group,
              name_tr,
              name_en,
              name_ru,
              name_ar,
              price_difference_try,
              sort_order,
              is_active
            `,
            )
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),

          supabase
            .from("product_removables")
            .select(
              `
              id,
              product_id,
              name_tr,
              name_en,
              name_ru,
              name_ar,
              sort_order,
              is_active
            `,
            )
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),

          supabase
            .from("product_recommendations")
            .select(
              `
              id,
              product_id,
              recommended_product_id,
              sort_order,
              is_active,
              products:recommended_product_id (
                id,
                slug,
                name_tr,
                name_en,
                name_ru,
                name_ar,
                image_url,
                price_try
              )
            `,
            )
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
        ]);

        if (settingsResult.error) throw settingsResult.error;
        if (categoriesResult.error) throw categoriesResult.error;
        if (productsResult.error) throw productsResult.error;

        setSettings(settingsResult.data as Settings);
        setCategories((categoriesResult.data || []) as Category[]);
        setProducts((productsResult.data || []) as Product[]);
        setTable((tableResult.data || null) as RestaurantTable);
        setOptions(
          optionsResult.error
            ? []
            : ((optionsResult.data || []) as ProductOption[]),
        );
        setRemovables(
          removablesResult.error
            ? []
            : ((removablesResult.data || []) as ProductRemovable[]),
        );
        setRecommendations(
          recommendationsResult.error
            ? []
            : ((recommendationsResult.data || []) as ProductRecommendation[]),
        );

        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Menu load failed:", error);

        if (attempt === 2) {
          setErrorText(t("loadError"));
          setIsLoading(false);
          return;
        }

        await wait(400 * (attempt + 1));
      }
    }
  }, [restaurantId, tableSlug, t]);

  useEffect(() => {
    void loadMenuData();
  }, [loadMenuData]);

  return {
    settings,
    categories,
    products,
    table,
    options,
    removables,
    recommendations,
    isLoading,
    errorText,
    reload: loadMenuData,
  };
}
