"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { type Locale } from "@/i18n";

import { Container } from "@/components/layout/Container";
import { MenuCategoryFilter } from "@/components/menu/MenuCategoryFilter";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type MenuCategory = {
  id: string;
  slug: string;
  name: Record<Locale, string>;
};

type MenuProduct = {
  id: string;
  slug: string;
  categorySlug: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  image: string;
  priceTry: number;
  priceUsd: number;
  preparationMinutes: number;
  portionCount: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
};

type MenuPageClientProps = {
  locale: Locale;
  categories: MenuCategory[];
  products: MenuProduct[];
};

export function MenuPageClient({
  locale,
  categories,
  products,
}: MenuPageClientProps) {
  const t = useTranslations("menuPage");

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }

    return products.filter((item) => item.categorySlug === activeCategory);
  }, [activeCategory, products]);

  const categoryLabels = {
    all: t("all"),
    ...Object.fromEntries(
      categories.map((category) => [category.slug, category.name[locale]]),
    ),
  };

  return (
    <main className="min-h-screen bg-[#FBF8F1] pb-24 pt-36">
      <Container>
        <Reveal>
          <SectionHeading
            centered
            label={t("label")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12">
            <MenuCategoryFilter
              categories={categories.map((category) => category.slug)}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
              labels={categoryLabels}
            />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-16 grid gap-8">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
