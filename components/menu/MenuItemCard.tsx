
import Link from 'next/link';
import { Clock } from 'lucide-react';

import { type Locale } from '@/i18n';
import { formatCurrency } from '@/lib/utils';
import {
  formatPreparationTime,
  formatPortion,
} from '@/lib/formatters';
import { SafeImage } from '../ui/SafeImage';

type MenuProduct = {
  id: string;
  slug: string;
  categorySlug: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  image: string;
  priceTry: number;
  priceUsd: number;
  preparationMinutes: number;
  portionCount: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
};

type MenuItemCardProps = {
  item: MenuProduct;
  locale: Locale;
};

export function MenuItemCard({
  item,
  locale,
}: MenuItemCardProps) {
  return (
    <Link
      href={`/${locale}/menu/${item.slug}`}
      className="group grid overflow-hidden border border-neutral-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-cardHover md:grid-cols-[260px_1fr]"
    >
      <div className="relative min-h-[260px] overflow-hidden">
        <SafeImage
          src={item.image}
          alt={item.name[locale]}
          fill
          unoptimized={item.image.startsWith('https://')}
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 260px"
        />
      </div>

      <div className="flex flex-col justify-center p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
              {item.categorySlug}
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold text-dark-bg">
              {item.name[locale]}
            </h2>
          </div>

          <p className="text-xl font-bold text-brand-gold">
            {locale === 'tr'
              ? formatCurrency(item.priceTry, 'TRY')
              : formatCurrency(item.priceUsd, 'USD')}
          </p>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-600">
          {item.description[locale]}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand-gold" />
            {formatPreparationTime(item.preparationMinutes, locale)}
          </span>

          <span>{formatPortion(item.portionCount, locale)}</span>

          {item.isVegetarian && (
            <span className="rounded-full bg-brand-gold/10 px-3 py-1 font-semibold text-brand-gold">
              Vegetarian
            </span>
          )}

          {item.isVegan && (
            <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
              Vegan
            </span>
          )}

          {item.isGlutenFree && (
            <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
              Gluten Free
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}