import { notFound } from "next/navigation";

import { locales, type Locale } from "@/i18n";
import { QrMenuClient } from "@/components/qr/QrMenuClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type QrMenuPageProps = {
  params: Promise<{
    locale: string;
    tableId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function QrMenuPage({ params }: QrMenuPageProps) {
  const { locale, tableId } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();

  const { data: table, error } = await supabase
    .from("restaurant_tables")
    .select("*")
    .eq("slug", tableId)
    .single();

  if (error || !table) {
    notFound();
  }

  const mappedTable = {
    id: table.id,
    slug: table.slug,
    label: table.label,
    capacity: table.capacity,
    status: table.status,
    qrActive: table.qr_active,
    isActive: table.is_active,
  };

  if (!mappedTable.qrActive || !mappedTable.isActive) {
    notFound();
  }
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select(
      `
    id,
    slug,
    name_tr,
    name_en,
    name_ru
  `,
    )
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

  const mappedCategories =
    categoriesData?.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: {
        tr: category.name_tr,
        en: category.name_en,
        ru: category.name_ru,
      },
    })) ?? [];

  const mappedProducts =
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
      };
    }) ?? [];

  return (
    <QrMenuClient
      locale={locale as Locale}
      table={mappedTable}
      categories={mappedCategories}
      products={mappedProducts}
    />
  );
}
