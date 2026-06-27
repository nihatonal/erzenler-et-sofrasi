import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import { formatCurrency } from "@/lib/utils";
import type { LocaleCode, Product, ProductOption, ProductRemovable } from "../types";
import { getLocalizedName, getProductDescription } from "../utils";

type ProductCardProps = {
  product: Product;
  index: number;
  activeLocale: LocaleCode;
  canAddToCart: boolean;
  options: ProductOption[];
  removables: ProductRemovable[];
  onOpen: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
};

export function ProductCard({
  product,
  index,
  activeLocale,
  canAddToCart,
  options,
  removables,
  onOpen,
  onQuickAdd,
}: ProductCardProps) {
  const t = useTranslations("menu");
  const productName = getLocalizedName(product, activeLocale);
  const productDescription = getProductDescription(product, activeLocale);

  function handleAddClick(event: React.MouseEvent) {
    event.stopPropagation();

    const productOptions = options.filter((o) => o.product_id === product.id);
    const productRemovables = removables.filter(
      (r) => r.product_id === product.id,
    );
    const hasCustomization =
      productOptions.length > 0 || productRemovables.length > 0;

    if (hasCustomization) {
      onOpen(product);
    } else {
      onQuickAdd(product);
    }
  }

  return (
    <article
      onClick={() => onOpen(product)}
      className="grid cursor-pointer grid-cols-[104px_1fr] overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm transition hover:border-brand-red md:grid-cols-[132px_1fr]"
    >
      <div className="relative h-full min-h-[128px] bg-neutral-100 md:min-h-[146px]">
        <Image
          src={product.image_url || "/images/menu/fettuccine.webp"}
          alt={productName}
          fill
          unoptimized
          priority={index < 3}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
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

        <div className="flex items-end justify-between gap-2">
          <div>
            {product.old_price_try && (
              <p className="text-xs font-semibold text-neutral-400 line-through">
                {formatCurrency(Number(product.old_price_try), "TRY")}
              </p>
            )}

            <p className="text-lg font-bold leading-none text-brand-red md:text-xl">
              {formatCurrency(Number(product.price_try), "TRY")}
            </p>
          </div>

          {canAddToCart ? (
            <button
              type="button"
              onClick={handleAddClick}
              className="flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-brand-green px-5 text-xs font-bold text-white transition hover:bg-brand-greenLight md:h-10 md:px-4"
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
}
