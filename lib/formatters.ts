import { type Locale } from '@/i18n';

export function formatPreparationTime(
  minutes: number,
  locale: Locale
) {
  if (locale === 'en') {
    return `${minutes} min`;
  }

  if (locale === 'ru') {
    return `${minutes} мин`;
  }

  return `${minutes} dk`;
}

export function formatPortion(
  count: number,
  locale: Locale
) {
  if (locale === 'en') {
    return count === 1
      ? 'Serves 1'
      : `Serves ${count}`;
  }

  if (locale === 'ru') {
    return count === 1
      ? '1 порция'
      : `${count} порции`;
  }

  return count === 1
    ? '1 kişilik'
    : `${count} kişilik`;
}