import { type Locale } from "@/i18n";

export type MenuCategory =
  | "starters"
  | "salads"
  | "mains"
  | "burgers"
  | "pasta"
  | "desserts"
  | "drinks";

export type MenuItem = {
  id: string;
  slug: string;
  category: MenuCategory;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  priceTry: number;
  priceUsd: number;
  image: string;
  preparationMinutes: number;
  portionCount: number;
  isFeatured?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
};

