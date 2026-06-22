import { notFound } from "next/navigation";

import { locales, type Locale } from "@/i18n";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MenuPageClient } from "@/components/menu/MenuPageClient";
import { createMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type MenuPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "metadata.menu",
  });

  return createMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    path: "/menu",
    image: "/og/menu.webp",
  });
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();

  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("id, slug, name_tr, name_en, name_ru")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        name_tr,
        name_en,
        name_ru,
        description_tr,
        description_en,
        description_ru,
        image_url,
        price_try,
        price_usd,
        preparation_minutes,
        portion_count,
        is_vegetarian,
        is_vegan,
        is_gluten_free,
        categories (
          slug
        )
      `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (productsError) {
    throw new Error(productsError.message);
  }

  const categories =
    categoriesData?.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: {
        tr: category.name_tr,
        en: category.name_en,
        ru: category.name_ru,
      },
    })) ?? [];

  const products =
    productsData?.map((product) => {
      const category = product.categories as {
        slug?: string;
      } | null;

      return {
        id: product.id,
        slug: product.slug,
        categorySlug: category?.slug ?? "",
        name: {
          tr: product.name_tr,
          en: product.name_en,
          ru: product.name_ru,
        },
        description: {
          tr: product.description_tr,
          en: product.description_en,
          ru: product.description_ru,
        },
        image: product.image_url || "/images/menu/fettuccine.png",
        priceTry: Number(product.price_try ?? 0),
        priceUsd: Number(product.price_usd ?? 0),
        preparationMinutes: product.preparation_minutes ?? 0,
        portionCount: product.portion_count ?? 1,
        isVegetarian: product.is_vegetarian,
        isVegan: product.is_vegan,
        isGlutenFree: product.is_gluten_free,
      };
    }) ?? [];

  return (
    <MenuPageClient
      locale={locale as Locale}
      categories={categories}
      products={products}
    />
  );
}
