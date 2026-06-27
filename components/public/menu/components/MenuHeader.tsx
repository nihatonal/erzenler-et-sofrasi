"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Category, LocaleCode } from "../types";
import { getLocalizedName } from "../utils";

const MOBILE_HEADER_HEIGHT = 64; // MobileAppHeader yüksekliği (px)
const SCROLL_THRESHOLD = 60;

type MenuHeaderProps = {
  categories: Category[];
  activeCategory: string;
  searchQuery: string;
  activeLocale: LocaleCode;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (query: string) => void;
};

export function MenuHeader({
  categories,
  activeCategory,
  searchQuery,
  activeLocale,
  onCategoryChange,
  onSearchChange,
}: MenuHeaderProps) {
  const t = useTranslations("menu");
  const [appHeaderHidden, setAppHeaderHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      setAppHeaderHidden(currentY > lastY && currentY > SCROLL_THRESHOLD);
      setLastY(currentY);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <section
      className="fixed left-0 right-0 z-20 border-b border-brand-sand bg-brand-cream/95 px-4 py-3 backdrop-blur transition-[top] duration-300 md:px-6"
      style={{ top: appHeaderHidden ? 0 : MOBILE_HEADER_HEIGHT }}
    >
      <div className="mx-auto grid max-w-6xl gap-2.5">
        <div className="relative md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10 w-full rounded-xl border border-brand-sand bg-white pl-9 pr-4 text-sm text-brand-green outline-none focus:border-brand-red md:h-11"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
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
              onClick={() => onCategoryChange(category.id)}
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
  );
}