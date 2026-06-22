import { HomeHero } from "@/components/public/HomeHero";
import { AboutSection } from "@/components/public/AboutSection";
import { FeaturedMenuSection } from "@/components/public/FeaturedMenuSection";
import { QrExperienceSection } from "@/components/public/QrExperienceSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { ContactSection } from "@/components/public/ContactSection";

import { locales, type Locale } from "@/i18n";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "metadata.home",
  });

  return createMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    path: "",
    image: "/og/home.webp",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  return (
    <main>
      <HomeHero locale={locale as Locale} />
      <AboutSection />
      {/* <FeaturedMenuSection locale={locale as Locale} /> */}
      <QrExperienceSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
