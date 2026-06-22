"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductOptionsPanel } from "@/components/admin/products/ProductOptionsPanel";
import { ProductRemovablesPanel } from "@/components/admin/products/ProductRemovablesPanel";

import {
  createProductOptionAction,
  createProductRemovableAction,
  deleteProductOptionAction,
  deleteProductRemovableAction,
  updateProductAction,
} from "@/app/admin/(dashboard)/products/actions";

type CategoryRow = {
  id: string;
  name_tr: string;
};

type ProductRow = {
  id: string;
  slug: string;
  category_id: string | null;

  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;

  description_tr: string | null;
  description_en: string | null;
  description_ru: string | null;
  description_ar: string | null;

  image_url: string | null;

  price_try: number;
  old_price_try: number | null;
  discount_percent: number | null;

  is_popular: boolean;
  is_recommended: boolean;
  is_new: boolean;
  is_discounted: boolean;

  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;

  is_active: boolean;
};

type ProductOption = {
  id: string;
  option_group: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  price_difference_try: number | null;
  sort_order: number | null;
  is_active: boolean;
};

type ProductRemovable = {
  id: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  sort_order: number | null;
  is_active: boolean;
};

type EditProductClientProps = {
  productId: string;
  restaurantId: string;
};

export function EditProductClient({
  productId,
  restaurantId,
}: EditProductClientProps) {
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [removables, setRemovables] = useState<ProductRemovable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const loadProductData = useCallback(async () => {
    setIsLoading(true);
    setErrorText("");

    const supabase = createSupabaseBrowserClient();

    try {
      const [productResult, categoriesResult, optionsResult, removablesResult] =
        await Promise.all([
          supabase
            .from("products")
            .select(
              `
              id,
              slug,
              category_id,
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
              is_spicy,
              is_active
            `
            )
            .eq("id", productId)
            .eq("restaurant_id", restaurantId)
            .single(),

          supabase
            .from("categories")
            .select("id, name_tr")
            .eq("restaurant_id", restaurantId)
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),

          supabase
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
            .order("sort_order", { ascending: true }),

          supabase
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
            `
            )
            .eq("product_id", productId)
            .eq("restaurant_id", restaurantId)
            .order("sort_order", { ascending: true }),
        ]);

      if (productResult.error || !productResult.data) {
        throw productResult.error || new Error("Ürün bulunamadı.");
      }

      setProduct(productResult.data as ProductRow);
      setCategories((categoriesResult.data || []) as CategoryRow[]);
      setOptions((optionsResult.data || []) as ProductOption[]);
      setRemovables((removablesResult.data || []) as ProductRemovable[]);
    } catch (error) {
      console.error(error);
      setErrorText("Ürün bilgileri yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, [productId, restaurantId]);

  useEffect(() => {
    void loadProductData();
  }, [loadProductData]);

  if (isLoading) {
    return (
      <div className="grid gap-8">
        <div className="h-[520px] animate-pulse rounded-2xl bg-brand-cream" />
        <div className="h-64 animate-pulse rounded-2xl bg-brand-cream" />
        <div className="h-64 animate-pulse rounded-2xl bg-brand-cream" />
      </div>
    );
  }

  if (errorText || !product) {
    return (
      <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-10 text-center">
        <h2 className="text-xl font-semibold text-brand-green">
          Ürün bilgileri yüklenemedi
        </h2>

        <p className="mt-2 text-sm text-brand-muted">
          {errorText || "Lütfen tekrar deneyin."}
        </p>

        <button
          type="button"
          onClick={loadProductData}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold text-white transition hover:bg-brand-redLight"
        >
          <RefreshCw className="h-4 w-4" />
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <>
      <ProductForm
        mode="edit"
        product={product}
        categories={categories}
        action={updateProductAction.bind(null, product.id)}
      />

      <ProductOptionsPanel
        productId={product.id}
        options={options}
        createAction={createProductOptionAction}
        deleteAction={deleteProductOptionAction}
      />

      <ProductRemovablesPanel
        productId={product.id}
        removables={removables}
        createAction={createProductRemovableAction}
        deleteAction={deleteProductRemovableAction}
      />
    </>
  );
}