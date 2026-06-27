import type {
  LocaleCode,
  OrderMode,
  Product,
  RecommendedProduct,
  RestaurantTable,
  Settings,
} from "./types";

export function normalizeLocale(locale: string): LocaleCode {
  if (locale === "en" || locale === "ru" || locale === "ar") return locale;
  return "tr";
}

export function getLocalizedName(
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

export function getProductDescription(product: Product, locale: LocaleCode) {
  if (locale === "en") return product.description_en || product.description_tr;
  if (locale === "ru") return product.description_ru || product.description_tr;
  if (locale === "ar") return product.description_ar || product.description_tr;
  return product.description_tr;
}

export function getOrderMode(
  settings: Settings,
  table: RestaurantTable,
): OrderMode {
  const hasTable = Boolean(table?.id && table?.is_active && table?.qr_active);

  if (hasTable && settings?.is_qr_ordering_enabled) return "table";
  if (!hasTable && settings?.is_online_ordering_enabled) return "delivery";

  return "menu_only";
}

export function getProductTagPriority(product: Product) {
  if (product.is_popular) return 1;
  if (product.is_recommended) return 2;
  if (product.is_discounted) return 3;
  if (product.is_new) return 4;
  return 9;
}

export function normalizeRecommendedProduct(
  value: RecommendedProduct | RecommendedProduct[] | null,
) {
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
