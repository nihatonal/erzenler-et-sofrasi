import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { locales, type Locale } from "@/i18n";

type SeoPage = "home" | "menu";

type BuildSeoMetadataArgs = {
  locale: string;
  page: SeoPage;
  path: string;
  image?: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function normalizeLocale(locale: string): Locale {
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return "tr";
}

export async function buildSeoMetadata({
  locale,
  page,
  path,
  image = "/images/og/erzenler-og.jpg",
}: BuildSeoMetadataArgs): Promise<Metadata> {
  const currentLocale = normalizeLocale(locale);

  const t = await getTranslations({
    locale: currentLocale,
    namespace: `metadata.${page}`,
  });

  const title = t("title");
  const description = t("description");
  const keywords = t.raw("keywords") as string[];

  const canonicalPath = `/${currentLocale}${path}`;
  const canonicalUrl = new URL(canonicalPath, siteUrl).toString();
  const imageUrl = new URL(image, siteUrl).toString();

  const languages = Object.fromEntries(
    locales.map((item) => [item, `/${item}${path}`]),
  );

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      type: "website",
      locale: currentLocale,
      url: canonicalUrl,
      siteName: "Erzenler Et Sofrası",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}