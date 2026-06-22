import { notFound } from "next/navigation";

import { locales, type Locale } from "@/i18n";

import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryCta } from "@/components/gallery/GalleryCta";
import { createMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type GalleryPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "metadata.gallery",
  });

  return createMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    path: "/gallery",
    image: "/og/gallery.webp",
  });
}
export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  return (
    <main className="overflow-hidden">
      <GalleryHero locale={currentLocale} />
      <GalleryGrid locale={currentLocale} />
      <GalleryCta locale={currentLocale} />
    </main>
  );
}
