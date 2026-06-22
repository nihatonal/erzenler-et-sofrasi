import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['tr', 'en', 'ru', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'tr';

export const rtlLocales: Locale[] = ['ar'];

export function isRtlLocale(locale: Locale) {
  return rtlLocales.includes(locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});