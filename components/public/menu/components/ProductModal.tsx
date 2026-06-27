import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { formatCurrency } from "@/lib/utils";
import type {
  LocaleCode,
  Product,
  ProductOption,
  ProductRecommendation,
  ProductRemovable,
} from "../types";
import {
  getLocalizedName,
  getProductDescription,
  normalizeRecommendedProduct,
} from "../utils";

type ProductModalProps = {
  product: Product;
  activeLocale: LocaleCode;
  canAddToCart: boolean;
  selectedOptions: ProductOption[];
  selectedRemovables: ProductRemovable[];
  selectedRecommendations: ProductRecommendation[];
  selectedOptionId: string | null;
  selectedRemovableIds: string[];
  quantity: number;
  note: string;
  modalTotalPrice: number;
  allProducts: Product[];
  onClose: () => void;
  onOptionSelect: (optionId: string) => void;
  onRemovableToggle: (itemId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onNoteChange: (note: string) => void;
  onAddToCart: () => void;
  onOpenProduct: (product: Product) => void;
};

export function ProductModal({
  product,
  activeLocale,
  canAddToCart,
  selectedOptions,
  selectedRemovables,
  selectedRecommendations,
  selectedOptionId,
  selectedRemovableIds,
  quantity,
  note,
  modalTotalPrice,
  allProducts,
  onClose,
  onOptionSelect,
  onRemovableToggle,
  onQuantityChange,
  onNoteChange,
  onAddToCart,
  onOpenProduct,
}: ProductModalProps) {
  const t = useTranslations("menu");

  return (
    <div className="fixed pb-0 inset-0 z-[99] flex items-end bg-black/50 p-0 md:items-center md:justify-center md:p-6">
      <div className="max-h-[100vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl md:max-w-3xl md:rounded-3xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-sand bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">
              {t("detail.eyebrow")}
            </p>
            <h2 className="mt-1 text-xl font-bold text-brand-green">
              {getLocalizedName(product, activeLocale)}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand text-brand-green"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-6 p-5 md:grid-cols-[280px_1fr]">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 md:aspect-square">
            <Image
              src={product.image_url || "/images/menu/fettuccine.webp"}
              alt={getLocalizedName(product, activeLocale)}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) calc(100vw - 40px), 280px"
            />
          </div>

          {/* Details */}
          <div>
            <h3 className="text-3xl font-bold text-brand-green">
              {getLocalizedName(product, activeLocale)}
            </h3>

            {getProductDescription(product, activeLocale) && (
              <p className="mt-3 text-sm leading-7 text-brand-muted">
                {getProductDescription(product, activeLocale)}
              </p>
            )}

            {/* Options */}
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
                      onClick={() => onOptionSelect(option.id)}
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
                            ? `+${formatCurrency(Number(option.price_difference_try), "TRY")}`
                            : t("free")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Removables */}
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
                        onClick={() => onRemovableToggle(item.id)}
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

            {/* Note & Quantity */}
            {canAddToCart && (
              <>
                <div className="mt-6">
                  <label className="font-bold text-brand-green">
                    {t("detail.note")}
                  </label>

                  <textarea
                    value={note}
                    onChange={(event) => onNoteChange(event.target.value)}
                    rows={3}
                    placeholder={t("detail.notePlaceholder")}
                    className="admin-input mt-3 py-3"
                  />
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="w-10 text-center font-bold">{quantity}</span>

                  <button
                    type="button"
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {/* Price & CTA */}
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                {product.old_price_try && (
                  <p className="text-sm font-semibold text-neutral-400 line-through">
                    {formatCurrency(Number(product.old_price_try), "TRY")}
                  </p>
                )}

                <p className="text-3xl font-bold text-brand-red">
                  {formatCurrency(modalTotalPrice, "TRY")}
                </p>
              </div>

              {canAddToCart ? (
                <button
                  type="button"
                  onClick={onAddToCart}
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

          {/* Recommendations */}
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
                        const foundProduct = allProducts.find(
                          (p) => p.id === recommended.id,
                        );
                        if (foundProduct) onOpenProduct(foundProduct);
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
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 768px) 50vw, 220px"
                        />
                      </div>

                      <div className="p-3">
                        <p className="line-clamp-1 text-sm font-bold text-brand-green">
                          {getLocalizedName(recommended, activeLocale)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-brand-red">
                          {formatCurrency(Number(recommended.price_try), "TRY")}
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
  );
}
