import { type Locale } from '@/i18n';

type SeoInput = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function createMetadata({
  locale,
  title,
  description,
  path = '',
  image = '/og-image.jpg',
}: SeoInput) {
  const siteName = 'Mira Bistro';

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  const url = `${baseUrl}/${locale}${path}`;

  return {
    title,
    description,

    metadataBase: new URL(baseUrl),

    alternates: {
      canonical: url,
      languages: {
        tr: `/tr${path}`,
        en: `/en${path}`,
        ru: `/ru${path}`,
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type: 'website',

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}