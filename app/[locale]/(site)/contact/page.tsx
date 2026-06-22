import { notFound } from "next/navigation";

import { locales, type Locale } from "@/i18n";

import { ContactHero } from "@/components/contact/ContactHero";
import { ContactCards } from "@/components/contact/ContactCards";
import { WorkingHours } from "@/components/contact/WorkingHours";
import { ContactMap } from "@/components/contact/ContactMap";
import { ContactCta } from "@/components/contact/ContactCta";
import { createMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type ContactPageProps = {
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
    namespace: "metadata.contact",
  });

  return createMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    path: "/contact",
    image: "/og/contact.webp",
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const currentLocale = locale as Locale;

  return (
    <main className="overflow-hidden">
      <ContactHero locale={currentLocale} />

      <ContactCards locale={currentLocale} />

      <WorkingHours locale={currentLocale} />

      <ContactMap locale={currentLocale} />

      <ContactCta locale={currentLocale} />
    </main>
  );
}
