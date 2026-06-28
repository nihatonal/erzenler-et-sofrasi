import type { Metadata } from "next";

import { HomeHero } from "@/components/public/home/HomeHero";
import { HomeStory } from "@/components/public/home/HomeStory";
import { HomeFlavors } from "@/components/public/home/HomeFlavors";
import { HomeOrderCta } from "@/components/public/home/HomeOrderCta";
import { HomeOrderPlatforms } from "@/components/public/home/HomeOrderPlatforms";
// import { HomeReviews } from "@/components/public/home/HomeReviews";
import { HomeGalleryPreview } from "@/components/public/home/HomeGalleryPreview";
import { HomeContactLocation } from "@/components/public/home/HomeContactLocation";
import { type Locale } from "@/i18n";
import { buildSeoMetadata } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildSeoMetadata({
    locale,
    page: "home",
    path: "",
    image: "/images/og/home-og.jpg",
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  return (
    <main className="bg-brand-cream">
      <HomeHero locale={currentLocale} />
      <HomeStory locale={currentLocale} />
      <HomeFlavors locale={currentLocale} />
      <HomeOrderCta locale={currentLocale} />
      <HomeOrderPlatforms locale={currentLocale} />
      {/* <HomeReviews locale={currentLocale} /> */}
      <HomeGalleryPreview locale={currentLocale} />
      <HomeContactLocation locale={currentLocale} />
    </main>
  );
}