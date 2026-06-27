export type LocaleCode = "tr" | "en" | "ru" | "ar";
export type OrderMode = "table" | "delivery" | "menu_only";
export type CartOrderMode = Exclude<OrderMode, "menu_only">;

export type Settings = {
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

export type Category = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  sort_order: number | null;
};

export type Product = {
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

export type RestaurantTable = {
  id: string;
  label: string;
  slug: string;
  qr_active: boolean;
  is_active: boolean;
} | null;

export type ProductOption = {
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

export type ProductRemovable = {
  id: string;
  product_id: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  sort_order: number | null;
  is_active: boolean;
};

export type RecommendedProduct = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  image_url: string | null;
  price_try: number;
};

export type ProductRecommendation = {
  id: string;
  product_id: string;
  recommended_product_id: string;
  sort_order: number | null;
  is_active: boolean;
  products: RecommendedProduct | RecommendedProduct[] | null;
};
