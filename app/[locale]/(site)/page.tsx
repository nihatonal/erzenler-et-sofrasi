import { HomeHero } from "@/components/public/home/HomeHero";
import { HomeStory } from "@/components/public/home/HomeStory";
import { HomeFlavors } from "@/components/public/home/HomeFlavors";
import { HomeOrderCta } from "@/components/public/home/HomeOrderCta";
import { HomeOrderPlatforms } from "@/components/public/home/HomeOrderPlatforms";
// import { HomeReviews } from "@/components/public/home/HomeReviews";
import { HomeGalleryPreview } from "@/components/public/home/HomeGalleryPreview";
import { HomeContactLocation } from "@/components/public/home/HomeContactLocation";
import { type Locale } from "@/i18n";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <main className="bg-brand-cream">
      <HomeHero locale={locale as Locale} />
      <HomeStory locale={locale as Locale} />
      <HomeFlavors locale={locale as Locale} />
      <HomeOrderPlatforms locale={locale as Locale} />
      {/* <HomeReviews locale={locale as Locale} /> */}
      <HomeGalleryPreview locale={locale as Locale} />
      <HomeOrderCta locale={locale as Locale} />
      <HomeContactLocation locale={locale as Locale} />
    </main>
  );
}
