"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit, RefreshCw, Search, ChevronDown } from "lucide-react";

import { SafeImage } from "@/components/ui/SafeImage";
import { formatCurrency } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { DeleteProductButton } from "@/components/admin/products/DeleteProductButton";
import { deleteProductAction } from "@/app/admin/(dashboard)/products/actions";

type ProductCategory = {
  id?: string;
  name_tr?: string;
};

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
  is_discounted: boolean;
  categories: ProductCategory | null;
};

type SupabaseProductRow = Omit<ProductRow, "categories"> & {
  categories: ProductCategory[] | ProductCategory | null;
};

type AdminProductsClientProps = {
  restaurantId: string;
};

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AdminProductsClient({
  restaurantId,
}: AdminProductsClientProps) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

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
            is_discounted,
            categories (
              id,
              name_tr
            )
          `,
          )
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const normalizedProducts: ProductRow[] = (
          (data || []) as SupabaseProductRow[]
        ).map((item) => ({
          ...item,
          categories: Array.isArray(item.categories)
            ? item.categories[0] || null
            : item.categories,
        }));

        setProducts(normalizedProducts);
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
    void loadProducts();
  }, [loadProducts]);

  const categories = useMemo(() => {
    const map = new Map<string, ProductCategory>();

    products.forEach((product) => {
      const category = product.categories;
      if (!category?.name_tr) return;

      const key = category.id || category.name_tr;
      map.set(key, category);
    });

    return Array.from(map.values()).sort((a, b) =>
      String(a.name_tr || "").localeCompare(String(b.name_tr || ""), "tr"),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name_tr.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.description_tr?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        product.categories?.id === categoryFilter ||
        product.categories?.name_tr === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.is_active) ||
        (statusFilter === "inactive" && !product.is_active);

      const matchesTag =
        tagFilter === "all" ||
        (tagFilter === "popular" && product.is_popular) ||
        (tagFilter === "recommended" && product.is_recommended) ||
        (tagFilter === "new" && product.is_new) ||
        (tagFilter === "discounted" && product.is_discounted);

      return matchesSearch && matchesCategory && matchesStatus && matchesTag;
    });
  }, [products, searchQuery, categoryFilter, statusFilter, tagFilter]);

  function handleOptimisticDelete(productId: string) {
    setProducts((current) => current.filter((item) => item.id !== productId));
  }

  function resetFilters() {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setTagFilter("all");
  }

  return (
    <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-3 shadow-sm md:p-5">
      <div className="mb-4 grid gap-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative xl:w-[360px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Ürün ara..."
              className="h-11 w-full rounded-xl border border-brand-sand bg-white pl-10 pr-4 text-sm text-brand-green outline-none transition focus:border-brand-red"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:flex xl:items-center">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-brand-sand bg-white px-3 pr-10 text-sm font-semibold text-brand-green outline-none xl:w-auto"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map((category) => {
                  const value = category.id || category.name_tr || "";

                  return (
                    <option key={value} value={value}>
                      {category.name_tr}
                    </option>
                  );
                })}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-brand-sand bg-white px-3 pr-10 text-sm font-semibold text-brand-green outline-none xl:w-auto"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green" />
            </div>

            <div className="relative">
              <select
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-brand-sand bg-white px-3 pr-10 text-sm font-semibold text-brand-green outline-none xl:w-auto"
              >
                <option value="all">Tüm Etiketler</option>
                <option value="popular">Popüler</option>
                <option value="recommended">Şefin Önerisi</option>
                <option value="new">Yeni</option>
                <option value="discounted">İndirimli</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green" />
            </div>

            <button
              type="button"
              onClick={loadProducts}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-sand bg-white px-4 text-sm font-semibold text-brand-green transition hover:border-brand-red hover:text-brand-red"
            >
              <RefreshCw className="h-4 w-4" />
              Yenile
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-brand-muted">
          <p>
            {filteredProducts.length} / {products.length} ürün gösteriliyor
          </p>

          {(searchQuery ||
            categoryFilter !== "all" ||
            statusFilter !== "all" ||
            tagFilter !== "all") && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-semibold text-brand-red transition hover:text-brand-redDark"
            >
              Filtreleri temizle
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-2.5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl bg-brand-cream"
            />
          ))}
        </div>
      ) : errorText ? (
        <div className="py-12 text-center">
          <h2 className="text-lg font-semibold text-brand-green">
            Ürün listesi yüklenemedi
          </h2>
          <p className="mt-2 text-sm text-brand-muted">{errorText}</p>
        </div>
      ) : !filteredProducts.length ? (
        <div className="py-12 text-center">
          <h2 className="text-lg font-semibold text-brand-green">
            Ürün bulunamadı
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            Arama veya filtreleri değiştirerek tekrar deneyin.
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {filteredProducts.map((item) => {
            const category = item.categories;

            return (
              <div
                key={item.id}
                className="grid overflow-hidden rounded-xl border border-brand-sand bg-white shadow-sm md:grid-cols-[120px_1fr]"
              >
                <div className="relative h-24 bg-neutral-100 md:h-full">
                  <SafeImage
                    src={item.image_url || "/images/menu/fettuccine.webp"}
                    alt={item.name_tr}
                    fill
                    unoptimized={
                      item.image_url?.startsWith("https://") ?? false
                    }
                    className="object-cover"
                    sizes="76px"
                  />
                </div>

                <div className="grid gap-3 p-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.is_popular && (
                        <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-semibold text-brand-red">
                          Popüler
                        </span>
                      )}

                      {item.is_recommended && (
                        <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-semibold text-brand-red">
                          Şefin Önerisi
                        </span>
                      )}

                      {item.is_new && (
                        <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[10px] font-semibold text-brand-green">
                          Yeni
                        </span>
                      )}

                      {item.is_discounted && (
                        <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-semibold text-brand-red">
                          İndirimli
                        </span>
                      )}

                      <span
                        className={
                          item.is_active
                            ? "rounded-full bg-status-active/10 px-2 py-0.5 text-[10px] font-semibold text-status-active"
                            : "rounded-full bg-status-inactive/10 px-2 py-0.5 text-[10px] font-semibold text-status-inactive"
                        }
                      >
                        {item.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </div>

                    <h2 className="mt-1.5 truncate text-lg font-semibold leading-tight text-brand-green">
                      {item.name_tr}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-muted">
                      <span>
                        Kategori:{" "}
                        <span className="font-semibold text-brand-green">
                          {category?.name_tr || "-"}
                        </span>
                      </span>

                      {item.description_tr && (
                        <span className="hidden max-w-[360px] truncate lg:inline">
                          {item.description_tr}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <div className="flex min-w-[92px] items-baseline gap-2 md:justify-end">
                      {item.old_price_try && (
                        <span className="text-xs font-semibold text-neutral-400 line-through">
                          {formatCurrency(Number(item.old_price_try), "TRY")}
                        </span>
                      )}

                      <span className="text-lg font-bold text-brand-red">
                        {formatCurrency(Number(item.price_try), "TRY")}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${item.id}/edit`}
                        prefetch={false}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-sand text-brand-green transition hover:border-brand-red hover:text-brand-red"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <div onClick={() => handleOptimisticDelete(item.id)}>
                        <DeleteProductButton
                          action={deleteProductAction.bind(null, item.id)}
                          onDeleted={() => handleOptimisticDelete(item.id)}
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
