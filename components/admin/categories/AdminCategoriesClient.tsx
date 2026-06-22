"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { CategoryForm } from "./CategoryForm";
import { CategoryList } from "./CategoryList";

export type CategoryRow = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  sort_order: number | null;
  is_active: boolean;
};

type AdminCategoriesClientProps = {
  restaurantId: string;
};

export function AdminCategoriesClient({
  restaurantId,
}: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorText("");

    const supabase = createSupabaseBrowserClient();

    try {
      const { data, error } = await supabase
        .from("categories")
        .select(
          `
          id,
          slug,
          name_tr,
          name_en,
          name_ru,
          name_ar,
          sort_order,
          is_active
        `
        )
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      setCategories((data || []) as CategoryRow[]);
    } catch (error) {
      console.error(error);
      setErrorText("Kategoriler yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function handleOptimisticCreate(category: CategoryRow) {
    setCategories((current) =>
      [...current, category].sort(
        (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
      )
    );
  }

  function handleOptimisticUpdate(categoryId: string, updated: CategoryRow) {
    setCategories((current) =>
      current
        .map((item) => (item.id === categoryId ? updated : item))
        .sort(
          (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)
        )
    );
  }

  function handleOptimisticDelete(categoryId: string) {
    setCategories((current) => current.filter((item) => item.id !== categoryId));
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <CategoryForm onOptimisticCreate={handleOptimisticCreate} />

      <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-brand-green">
              Mevcut Kategoriler
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Kategorileri düzenleyin veya silin.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCategories}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand text-brand-green transition hover:border-brand-red hover:text-brand-red"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 grid gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-brand-cream"
              />
            ))}
          </div>
        ) : errorText ? (
          <div className="mt-6 rounded-2xl border border-brand-sand bg-white p-8 text-center">
            <h3 className="font-semibold text-brand-green">
              Kategoriler yüklenemedi
            </h3>
            <p className="mt-2 text-sm text-brand-muted">{errorText}</p>
          </div>
        ) : (
          <CategoryList
            categories={categories}
            onOptimisticUpdate={handleOptimisticUpdate}
            onOptimisticDelete={handleOptimisticDelete}
          />
        )}
      </section>
    </div>
  );
}