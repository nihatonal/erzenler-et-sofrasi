'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { locales, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

const labels: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
  ru: 'RU',
  ar: 'AR',
};

type LanguageSwitcherProps = {
  currentLocale: Locale;
  variant?: 'dark' | 'light';
};

export function LanguageSwitcher({
  currentLocale,
  variant = 'dark',
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  const activeLocale = locales.includes(segments[0] as Locale)
    ? (segments[0] as Locale)
    : currentLocale;

  function getLocalizedPath(locale: Locale) {
    const segments = pathname.split('/').filter(Boolean);

    if (locales.includes(segments[0] as Locale)) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }

    return `/${segments.join('/')}`;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-full p-1 backdrop-blur',
        variant === 'dark'
          ? 'border border-white/15 bg-black/20'
          : 'border border-neutral-200 bg-white'
      )}
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold transition',
            locale === activeLocale
              ? 'bg-brand-red text-white'
              : variant === 'dark'
                ? 'text-white/70 hover:text-brand-red'
                : 'text-neutral-600 hover:text-brand-red'
          )}
        >
          {labels[locale]}
        </Link>
      ))}
    </div>
  );
}