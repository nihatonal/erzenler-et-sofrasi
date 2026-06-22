"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Edit, RefreshCw } from "lucide-react";

import { SafeImage } from "@/components/ui/SafeImage";
import { formatCurrency } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { DeleteProductButton } from "@/components/admin/products/DeleteProductButton";
import { deleteProductAction } from "@/app/admin/(dashboard)/products/actions";

type ProductRow = {
  id: string;
  slug: string;
  name_tr: string;
  description_tr: string | null;
  image_url: string | null;
  price_try: number;
  old_price_try: number | null;
  discount_percent: number | null;
  is_active: boolean;
  is_popular: boolean;
  is_recommended: boolean;
  is_new: boolean;
  categories: { name_tr?: string } | null;
};

type AdminProductsClientProps = {
  restaurantId: string;
};

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AdminProductsClient({ restaurantId }: AdminProductsClientProps) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

const loadProducts = useCallback(async () => {
  setIsLoading(true);
  setErrorText("");

  const supabase = createSupabaseBrowserClient();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id,
          slug,
          name_tr,
          description_tr,
          image_url,
          price_try,
          old_price_try,
          discount_percent,
          is_active,
          is_popular,
          is_recommended,
          is_new,
          categories (
            name_tr
          )
        `
        )
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts((data || []) as ProductRow[]);
      setIsLoading(false);
      return;
    } catch (error) {
      console.error("Products load failed:", error);

      if (attempt === 2) {
        setErrorText("Ürünler yüklenemedi. Lütfen tekrar deneyin.");
        setIsLoading(false);
        return;
      }

      await wait(400 * (attempt + 1));
    }
  }
}, [restaurantId]);

useEffect(() => {
  loadProducts();
}, [loadProducts]);


  function handleOptimisticDelete(productId: string) {
    setProducts((current) => current.filter((item) => item.id !== productId));
  }

  return (
    <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-4 shadow-sm md:p-6">
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-2xl bg-brand-cream"
            />
          ))}
        </div>
      ) : errorText ? (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold text-brand-green">
            Ürün listesi yüklenemedi
          </h2>
          <p className="mt-2 text-sm text-brand-muted">{errorText}</p>

          <button
            type="button"
            onClick={loadProducts}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold text-white transition hover:bg-brand-redLight"
          >
            <RefreshCw className="h-4 w-4" />
            Tekrar Dene
          </button>
        </div>
      ) : !products.length ? (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold text-brand-green">
            Henüz ürün yok
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            İlk ürününüzü ekleyerek başlayın.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((item) => {
            const category = item.categories;

            return (
              <div
                key={item.id}
                className="grid overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm md:grid-cols-[180px_1fr]"
              >
                <div className="relative h-44 bg-neutral-100 md:h-full">
                  <SafeImage
                    src={item.image_url || "/images/menu/fettuccine.png"}
                    alt={item.name_tr}
                    fill
                    unoptimized={item.image_url?.startsWith("https://") ?? false}
                    className="object-cover"
                    sizes="180px"
                  />
                </div>

                <div className="flex flex-col justify-between gap-5 p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.is_popular && (
                        <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
                          Popüler
                        </span>
                      )}

                      {item.is_recommended && (
                        <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
                          Şefin Önerisi
                        </span>
                      )}

                      {item.is_new && (
                        <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                          Yeni
                        </span>
                      )}

                      <span
                        className={
                          item.is_active
                            ? "rounded-full bg-status-active/10 px-3 py-1 text-xs font-semibold text-status-active"
                            : "rounded-full bg-status-inactive/10 px-3 py-1 text-xs font-semibold text-status-inactive"
                        }
                      >
                        {item.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold text-brand-green">
                      {item.name_tr}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-muted">
                      {item.description_tr}
                    </p>

                    <p className="mt-3 text-sm text-brand-muted">
                      Kategori:{" "}
                      <span className="font-semibold text-brand-green">
                        {category?.name_tr || "-"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      {item.old_price_try && (
                        <span className="text-sm font-semibold text-neutral-400 line-through">
                          {formatCurrency(Number(item.old_price_try), "TRY")}
                        </span>
                      )}

                      <span className="text-2xl font-bold text-brand-red">
                        {formatCurrency(Number(item.price_try), "TRY")}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <Link
                        href={`/admin/products/${item.id}/edit`}
                        prefetch={false}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-sand text-brand-green transition hover:border-brand-red hover:text-brand-red"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <div onClick={() => handleOptimisticDelete(item.id)}>
                        <DeleteProductButton
                          action={deleteProductAction.bind(null, item.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}