"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Minus, Plus, RefreshCw, Search, ShoppingBag, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/cart/card-store";

type LocaleCode = "tr" | "en" | "ru" | "ar";
type OrderMode = "table" | "delivery" | "menu_only";

type Settings = {
  restaurant_name: string | null;
  restaurant_description: string | null;
  logo_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  is_qr_ordering_enabled: boolean;
  is_online_ordering_enabled: boolean;
  delivery_fee_try: number | null;
  minimum_order_try: number | null;
  estimated_delivery_minutes: number | null;
  enabled_locales: LocaleCode[] | null;
} | null;

type Category = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  sort_order: number | null;
};

type Product = {
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
  sort_order: number | null;
  is_popular: boolean;
  is_recommended: boolean;
  is_new: boolean;
  is_discounted: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
};

type RestaurantTable = {
  id: string;
  label: string;
  slug: string;
  qr_active: boolean;
  is_active: boolean;
} | null;

type ProductOption = {
  id: string;
  product_id: string;
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
  product_id: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  sort_order: number | null;
  is_active: boolean;
};

type RecommendedProduct = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  image_url: string | null;
  price_try: number;
};

type ProductRecommendation = {
  id: string;
  product_id: string;
  recommended_product_id: string;
  sort_order: number | null;
  is_active: boolean;
  products: RecommendedProduct | RecommendedProduct[] | null;
};

type PublicMenuClientProps = {
  locale: string;
  restaurantId: string;
  tableSlug: string | null;
};

function getProductTagPriority(product: Product) {
  if (product.is_popular) return 1;
  if (product.is_recommended) return 2;
  if (product.is_discounted) return 3;
  if (product.is_new) return 4;

  return 9;
}

function normalizeLocale(locale: string): LocaleCode {
  if (locale === "en" || locale === "ru" || locale === "ar") return locale;
  return "tr";
}

function getLocalizedName(
  item: {
    name_tr: string;
    name_en?: string | null;
    name_ru?: string | null;
    name_ar?: string | null;
  },
  locale: LocaleCode,
) {
  if (locale === "en") return item.name_en || item.name_tr;
  if (locale === "ru") return item.name_ru || item.name_tr;
  if (locale === "ar") return item.name_ar || item.name_tr;
  return item.name_tr;
}

function getProductDescription(product: Product, locale: LocaleCode) {
  if (locale === "en") return product.description_en || product.description_tr;
  if (locale === "ru") return product.description_ru || product.description_tr;
  if (locale === "ar") return product.description_ar || product.description_tr;
  return product.description_tr;
}

function getOrderMode(settings: Settings, table: RestaurantTable): OrderMode {
  const hasTable = Boolean(table?.id && table?.is_active && table?.qr_active);

  if (hasTable && settings?.is_qr_ordering_enabled) return "table";
  if (!hasTable && settings?.is_online_ordering_enabled) return "delivery";

  return "menu_only";
}

function normalizeRecommendedProduct(
  value: RecommendedProduct | RecommendedProduct[] | null,
) {
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function PublicMenuClient({
  locale,
  restaurantId,
  tableSlug,
}: PublicMenuClientProps) {
  const t = useTranslations("menu");
  const activeLocale = normalizeLocale(locale);

  const addItem = useCartStore((state) => state.addItem);
  const cartQuantity = useCartStore((state) => state.getTotalQuantity());
  const cartSubtotal = useCartStore((state) => state.getSubtotal());

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

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedRemovableIds, setSelectedRemovableIds] = useState<string[]>(
    [],
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

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

  const orderMode = getOrderMode(settings, table);
  const canAddToCart = orderMode !== "menu_only";

  const selectedOptions = useMemo(() => {
    if (!selectedProduct) return [];
    return options.filter((item) => item.product_id === selectedProduct.id);
  }, [options, selectedProduct]);

  const selectedRemovables = useMemo(() => {
    if (!selectedProduct) return [];
    return removables.filter((item) => item.product_id === selectedProduct.id);
  }, [removables, selectedProduct]);

  const selectedRecommendations = useMemo(() => {
    if (!selectedProduct) return [];

    return recommendations.filter((item) => {
      const recommended = normalizeRecommendedProduct(item.products);
      return item.product_id === selectedProduct.id && Boolean(recommended);
    });
  }, [recommendations, selectedProduct]);

  const selectedOption =
    selectedOptions.find((item) => item.id === selectedOptionId) || null;

  const selectedRemovableItems = selectedRemovables.filter((item) =>
    selectedRemovableIds.includes(item.id),
  );

  const modalTotalPrice = selectedProduct
    ? (Number(selectedProduct.price_try) +
        Number(selectedOption?.price_difference_try || 0)) *
      quantity
    : 0;
  const sortedProducts = useMemo(() => {
    const categoryOrderMap = new Map(
      categories.map((category) => [
        category.id,
        Number(category.sort_order ?? 999),
      ]),
    );

    return [...products].sort((a, b) => {
      const categoryA = categoryOrderMap.get(a.category_id || "") ?? 999;
      const categoryB = categoryOrderMap.get(b.category_id || "") ?? 999;

      if (categoryA !== categoryB) return categoryA - categoryB;

      const tagA = getProductTagPriority(a);
      const tagB = getProductTagPriority(b);

      if (tagA !== tagB) return tagA - tagB;

      const sortA = Number(a.sort_order ?? 0);
      const sortB = Number(b.sort_order ?? 0);

      if (sortA !== sortB) return sortA - sortB;

      return a.name_tr.localeCompare(b.name_tr, "tr");
    });
  }, [products, categories]);
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category_id === activeCategory;

      const productName = getLocalizedName(product, activeLocale).toLowerCase();
      const productDescription =
        getProductDescription(product, activeLocale)?.toLowerCase() || "";

      return (
        matchesCategory &&
        (!query ||
          productName.includes(query) ||
          productDescription.includes(query))
      );
    });
  }, [sortedProducts, activeCategory, searchQuery, activeLocale]);

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedOptionId(null);
    setSelectedRemovableIds([]);
    setQuantity(1);
    setNote("");
  }

  function closeProduct() {
    setSelectedProduct(null);
    setSelectedOptionId(null);
    setSelectedRemovableIds([]);
    setQuantity(1);
    setNote("");
  }

  function handleAddToCart() {
    if (!selectedProduct || orderMode === "menu_only") return;

    addItem({
      productId: selectedProduct.id,
      productSlug: selectedProduct.slug,
      productName: getLocalizedName(selectedProduct, activeLocale),
      productImageUrl: selectedProduct.image_url,
      basePriceTry: Number(selectedProduct.price_try),
      selectedOption: selectedOption
        ? {
            id: selectedOption.id,
            name: getLocalizedName(selectedOption, activeLocale),
            priceDifferenceTry: Number(
              selectedOption.price_difference_try || 0,
            ),
          }
        : null,
      removables: selectedRemovableItems.map((item) => ({
        id: item.id,
        name: getLocalizedName(item, activeLocale),
      })),
      note: note.trim() || null,
      orderMode,
      tableId: table?.id || null,
      tableLabel: table?.label || null,
      locale: activeLocale,
      quantity,
    });

    closeProduct();
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-brand-cream px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="h-28 animate-pulse rounded-2xl bg-brand-green/20" />
          <div className="mt-4 h-11 animate-pulse rounded-xl bg-white" />
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (errorText) {
    return (
      <main className="min-h-screen bg-brand-cream px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-brand-sand bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-brand-green">
            {t("errorTitle")}
          </h1>
          <p className="mt-2 text-sm text-brand-muted">{errorText}</p>

          <button
            type="button"
            onClick={loadMenuData}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            {t("retry")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream pb-24">
      <section className="sticky top-16 z-20 border-b border-brand-sand bg-brand-cream/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto grid max-w-6xl gap-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-10 w-full rounded-xl border border-brand-sand bg-white pl-9 pr-4 text-sm text-brand-green outline-none focus:border-brand-red md:h-11"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 ">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={
                activeCategory === "all"
                  ? "shrink-0 rounded-full bg-brand-red px-3.5 py-1.5 text-xs font-semibold text-white"
                  : "shrink-0 rounded-full border border-brand-sand bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-green"
              }
            >
              {t("allCategories")}
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={
                  activeCategory === category.id
                    ? "shrink-0 rounded-full bg-brand-red px-3.5 py-1.5 text-xs font-semibold text-white"
                    : "shrink-0 rounded-full border border-brand-sand bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-green"
                }
              >
                {getLocalizedName(category, activeLocale)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
        {!filteredProducts.length ? (
          <div className="rounded-2xl border border-dashed border-brand-sand bg-white p-10 text-center">
            <h2 className="font-semibold text-brand-green">
              {t("empty.title")}
            </h2>
            <p className="mt-2 text-sm text-brand-muted">
              {t("empty.description")}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {filteredProducts.map((product) => {
              const productName = getLocalizedName(product, activeLocale);
              const productDescription = getProductDescription(
                product,
                activeLocale,
              );

              return (
                <article
                  key={product.id}
                  onClick={() => openProduct(product)}
                  className="grid cursor-pointer grid-cols-[104px_1fr] overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm transition hover:border-brand-red md:grid-cols-[132px_1fr]"
                >
                  <div className="relative h-full min-h-[128px] bg-neutral-100 md:min-h-[146px]">
                    <Image
                      src={product.image_url || "/images/menu/fettuccine.webp"}
                      alt={productName}
                      fill
                      loading="eager"
                      unoptimized
                      className="object-cover"
                    />

                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {product.is_popular && (
                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-brand-red">
                          {t("badges.popular")}
                        </span>
                      )}

                      {product.is_discounted && (
                        <span className="rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">
                          {t("badges.discounted")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col justify-between p-3 md:p-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-1">
                        {product.is_recommended && (
                          <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[10px] font-bold text-brand-green">
                            {t("badges.recommended")}
                          </span>
                        )}

                        {product.is_new && (
                          <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[10px] font-bold text-brand-green">
                            {t("badges.new")}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-1.5 line-clamp-1 text-base font-bold leading-tight text-brand-green md:text-lg">
                        {productName}
                      </h2>

                      {productDescription && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-brand-muted md:text-sm">
                          {productDescription}
                        </p>
                      )}
                    </div>

                    <div className=" flex items-end justify-between gap-2">
                      <div>
                        {product.old_price_try && (
                          <p className="text-xs font-semibold text-neutral-400 line-through">
                            {formatCurrency(
                              Number(product.old_price_try),
                              "TRY",
                            )}
                          </p>
                        )}

                        <p className="text-lg font-bold leading-none text-brand-red md:text-xl">
                          {formatCurrency(Number(product.price_try), "TRY")}
                        </p>
                      </div>

                      {canAddToCart ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openProduct(product);
                          }}
                          className="flex h-7 shrink-0 items-center gap-1.5 rounded-full 
                          bg-brand-green px-5 text-xs font-bold text-white transition 
                          hover:bg-brand-greenLight md:h-10 md:px-4"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {t("add")}
                        </button>
                      ) : (
                        <span className="rounded-xl border border-brand-sand px-3 py-2 text-[10px] font-semibold text-brand-muted">
                          {t("menuOnly")}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {canAddToCart && cartQuantity > 0 && (
        <Link
          href={`/${activeLocale}/checkout`}
          className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex h-14 max-w-xl items-center justify-between rounded-2xl bg-brand-green px-5 text-white shadow-2xl"
        >
          <span className="text-sm font-bold">
            {cartQuantity} {t("cart.items")}
          </span>

          <span className="text-sm font-bold">
            {formatCurrency(cartSubtotal, "TRY")}
          </span>

          <span className="text-sm font-bold">{t("cart.view")}</span>
        </Link>
      )}

      {selectedProduct && (
        <div className="fixed pb-0 inset-0 z-[99] flex items-end bg-black/50 p-0 md:items-center md:justify-center md:p-6">
          <div className="max-h-[100vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl md:max-w-3xl md:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-sand bg-white px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">
                  {t("detail.eyebrow")}
                </p>
                <h2 className="mt-1 text-xl font-bold text-brand-green">
                  {getLocalizedName(selectedProduct, activeLocale)}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeProduct}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand text-brand-green"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[280px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 md:aspect-square">
                <Image
                  src={
                    selectedProduct.image_url || "/images/menu/fettuccine.webp"
                  }
                  alt={getLocalizedName(selectedProduct, activeLocale)}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-3xl font-bold text-brand-green">
                  {getLocalizedName(selectedProduct, activeLocale)}
                </h3>

                {getProductDescription(selectedProduct, activeLocale) && (
                  <p className="mt-3 text-sm leading-7 text-brand-muted">
                    {getProductDescription(selectedProduct, activeLocale)}
                  </p>
                )}

                {selectedOptions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-brand-green">
                      {t("detail.options")}
                    </h4>

                    <div className="mt-3 grid gap-2">
                      {selectedOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          disabled={!canAddToCart}
                          onClick={() => setSelectedOptionId(option.id)}
                          className={
                            selectedOptionId === option.id
                              ? "rounded-xl border-2 border-brand-red bg-brand-red/5 px-4 py-3 text-left text-sm"
                              : "rounded-xl border border-brand-sand bg-brand-cream px-4 py-3 text-left text-sm"
                          }
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-brand-green">
                              {getLocalizedName(option, activeLocale)}
                            </span>

                            <span className="font-semibold text-brand-red">
                              {Number(option.price_difference_try || 0) > 0
                                ? `+${formatCurrency(
                                    Number(option.price_difference_try),
                                    "TRY",
                                  )}`
                                : t("free")}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRemovables.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-brand-green">
                      {t("detail.removables")}
                    </h4>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedRemovables.map((item) => {
                        const selected = selectedRemovableIds.includes(item.id);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={!canAddToCart}
                            onClick={() =>
                              setSelectedRemovableIds((current) =>
                                selected
                                  ? current.filter((id) => id !== item.id)
                                  : [...current, item.id],
                              )
                            }
                            className={
                              selected
                                ? "rounded-full bg-brand-red px-3 py-2 text-sm font-semibold text-white"
                                : "rounded-full border border-brand-sand bg-white px-3 py-2 text-sm font-medium text-brand-green"
                            }
                          >
                            {getLocalizedName(item, activeLocale)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {canAddToCart && (
                  <>
                    <div className="mt-6">
                      <label className="font-bold text-brand-green">
                        {t("detail.note")}
                      </label>

                      <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={3}
                        placeholder={t("detail.notePlaceholder")}
                        className="admin-input mt-3 py-3"
                      />
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((value) => Math.max(1, value - 1))
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-10 text-center font-bold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuantity((value) => value + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    {selectedProduct.old_price_try && (
                      <p className="text-sm font-semibold text-neutral-400 line-through">
                        {formatCurrency(
                          Number(selectedProduct.old_price_try),
                          "TRY",
                        )}
                      </p>
                    )}

                    <p className="text-3xl font-bold text-brand-red">
                      {formatCurrency(modalTotalPrice, "TRY")}
                    </p>
                  </div>

                  {canAddToCart ? (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex h-12 items-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-bold text-white transition hover:bg-brand-greenLight"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {t("detail.addToCart")}
                    </button>
                  ) : (
                    <span className="rounded-xl border border-brand-sand px-4 py-3 text-xs font-semibold text-brand-muted">
                      {t("menuOnly")}
                    </span>
                  )}
                </div>
              </div>

              {selectedRecommendations.length > 0 && (
                <div className="border-t border-brand-sand pt-6 md:col-span-2">
                  <h4 className="font-bold text-brand-green">
                    {t("detail.recommendations")}
                  </h4>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {selectedRecommendations.map((recommendation) => {
                      const recommended = normalizeRecommendedProduct(
                        recommendation.products,
                      );

                      if (!recommended) return null;

                      return (
                        <button
                          key={recommendation.id}
                          type="button"
                          onClick={() => {
                            const foundProduct = products.find(
                              (product) => product.id === recommended.id,
                            );

                            if (foundProduct) openProduct(foundProduct);
                          }}
                          className="overflow-hidden rounded-2xl border border-brand-sand bg-white text-left transition hover:border-brand-red"
                        >
                          <div className="relative aspect-[4/3] bg-neutral-100">
                            <Image
                              src={
                                recommended.image_url ||
                                "/images/menu/fettuccine.webp"
                              }
                              alt={getLocalizedName(recommended, activeLocale)}
                              fill
                              loading="eager"
                              unoptimized
                              className="object-cover"
                            />
                          </div>

                          <div className="p-3">
                            <p className="line-clamp-1 text-sm font-bold text-brand-green">
                              {getLocalizedName(recommended, activeLocale)}
                            </p>
                            <p className="mt-1 text-sm font-bold text-brand-red">
                              {formatCurrency(
                                Number(recommended.price_try),
                                "TRY",
                              )}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
