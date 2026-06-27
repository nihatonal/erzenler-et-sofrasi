"use client";

import { useMemo, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart/card-store";
import { useToastStore } from "@/lib/toast/toast-store";

import type { Product } from "./types";
import {
  getLocalizedName,
  getOrderMode,
  getProductTagPriority,
  normalizeLocale,
  normalizeRecommendedProduct,
} from "./utils";
import { useMenuData } from "./hooks/useMenuData";
import { MenuHeader } from "./components/MenuHeader";
import { ProductCard } from "./components/ProductCard";
import { ProductModal } from "./components/ProductModal";
import { CartBar } from "./components/CartBar";

type PublicMenuClientProps = {
  locale: string;
  restaurantId: string;
  tableSlug: string | null;
};

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
  const showToast = useToastStore((state) => state.showToast);

  const {
    settings,
    categories,
    products,
    table,
    options,
    removables,
    recommendations,
    isLoading,
    errorText,
    reload,
  } = useMenuData({ restaurantId, tableSlug });

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedRemovableIds, setSelectedRemovableIds] = useState<string[]>(
    [],
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const orderMode = getOrderMode(settings, table);
  const canAddToCart = orderMode !== "menu_only";

  // Modal-scoped data
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

  const modalTotalPrice = selectedProduct
    ? (Number(selectedProduct.price_try) +
        Number(selectedOption?.price_difference_try || 0)) *
      quantity
    : 0;

  // Sorted + filtered products
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
        (
          product[`description_${activeLocale}` as keyof Product] as string
        )?.toLowerCase() || "";

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

  function handleRemovableToggle(itemId: string) {
    setSelectedRemovableIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  }

  function handleAddToCart() {
    if (!selectedProduct || orderMode === "menu_only") return;

    const selectedRemovableItems = removables.filter((item) =>
      selectedRemovableIds.includes(item.id),
    );

    addItem({
      productId: selectedProduct.id,
      productSlug: selectedProduct.slug,
      productName: selectedProduct.name_tr, // her zaman tr
      productName_en: selectedProduct.name_en,
      productName_ru: selectedProduct.name_ru,
      productName_ar: selectedProduct.name_ar,
      productImageUrl: selectedProduct.image_url,
      basePriceTry: Number(selectedProduct.price_try),
      selectedOption: selectedOption
        ? {
            id: selectedOption.id,
            name: selectedOption.name_tr,
            name_en: selectedOption.name_en,
            name_ru: selectedOption.name_ru,
            name_ar: selectedOption.name_ar,
            priceDifferenceTry: Number(
              selectedOption.price_difference_try || 0,
            ),
          }
        : null,
      removables: selectedRemovableItems.map((item) => ({
        id: item.id,
        name: item.name_tr,
        name_en: item.name_en,
        name_ru: item.name_ru,
        name_ar: item.name_ar,
      })),
      note: note.trim() || null,
      orderMode,
      tableId: table?.id || null,
      tableLabel: table?.label || null,
      locale: activeLocale,
      quantity,
    });

    showToast(
      t("addedToCart"),
      getLocalizedName(selectedProduct, activeLocale),
    );
    closeProduct();
  }

  function handleQuickAdd(product: Product) {
    if (orderMode === "menu_only") return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name_tr,
      productName_en: product.name_en,
      productName_ru: product.name_ru,
      productName_ar: product.name_ar,
      productImageUrl: product.image_url,
      basePriceTry: Number(product.price_try),
      selectedOption: null,
      removables: [],
      note: null,
      orderMode,
      tableId: table?.id || null,
      tableLabel: table?.label || null,
      locale: activeLocale,
      quantity: 1,
    });
    showToast( t("addedToCart"), getLocalizedName(product, activeLocale));
  }

  const sectionRef = useRef<HTMLElement>(null); // ← buraya

  // ← bu fonksiyonu ekle
  function handleCategoryChange(categoryId: string) {
    setActiveCategory(categoryId);
    setTimeout(() => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top, behavior: "smooth" });
    }, 50);
  }

  // Loading state
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

  // Error state
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
            onClick={reload}
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
      <MenuHeader
        categories={categories}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        activeLocale={activeLocale}
        onCategoryChange={handleCategoryChange} // setActiveCategory → handleCategoryChange
        onSearchChange={setSearchQuery}
      />

      <section
        ref={sectionRef}
        className="mx-auto max-w-6xl px-4 pt-48 md:px-6 md:py-6"
      >
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
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                activeLocale={activeLocale}
                canAddToCart={canAddToCart}
                options={options}
                removables={removables}
                onOpen={openProduct}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}
      </section>

      {canAddToCart && (
        <CartBar
          activeLocale={activeLocale}
          cartQuantity={cartQuantity}
          cartSubtotal={cartSubtotal}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          activeLocale={activeLocale}
          canAddToCart={canAddToCart}
          selectedOptions={selectedOptions}
          selectedRemovables={selectedRemovables}
          selectedRecommendations={selectedRecommendations}
          selectedOptionId={selectedOptionId}
          selectedRemovableIds={selectedRemovableIds}
          quantity={quantity}
          note={note}
          modalTotalPrice={modalTotalPrice}
          allProducts={products}
          onClose={closeProduct}
          onOptionSelect={setSelectedOptionId}
          onRemovableToggle={handleRemovableToggle}
          onQuantityChange={setQuantity}
          onNoteChange={setNote}
          onAddToCart={handleAddToCart}
          onOpenProduct={openProduct}
        />
      )}
    </main>
  );
}
