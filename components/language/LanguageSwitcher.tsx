"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ru: "RU",
  ar: "ع",
};

const legalSlugMap: Record<string, Record<Locale, string>> = {
  "gizlilik-politikasi": {
    tr: "gizlilik-politikasi",
    en: "privacy-policy",
    ru: "politika-konfidencialnosti",
    ar: "siyasat-alkhususiya",
  },
  "privacy-policy": {
    tr: "gizlilik-politikasi",
    en: "privacy-policy",
    ru: "politika-konfidencialnosti",
    ar: "siyasat-alkhususiya",
  },
  "politika-konfidencialnosti": {
    tr: "gizlilik-politikasi",
    en: "privacy-policy",
    ru: "politika-konfidencialnosti",
    ar: "siyasat-alkhususiya",
  },
  "siyasat-alkhususiya": {
    tr: "gizlilik-politikasi",
    en: "privacy-policy",
    ru: "politika-konfidencialnosti",
    ar: "siyasat-alkhususiya",
  },

  "cerez-politikasi": {
    tr: "cerez-politikasi",
    en: "cookie-policy",
    ru: "politika-cookie",
    ar: "siyasat-cookies",
  },
  "cookie-policy": {
    tr: "cerez-politikasi",
    en: "cookie-policy",
    ru: "politika-cookie",
    ar: "siyasat-cookies",
  },
  "politika-cookie": {
    tr: "cerez-politikasi",
    en: "cookie-policy",
    ru: "politika-cookie",
    ar: "siyasat-cookies",
  },
  "siyasat-cookies": {
    tr: "cerez-politikasi",
    en: "cookie-policy",
    ru: "politika-cookie",
    ar: "siyasat-cookies",
  },

  kvkk: {
    tr: "kvkk",
    en: "pdpl",
    ru: "zakon-o-personalnyh-dannyh",
    ar: "kvkk",
  },
  pdpl: {
    tr: "kvkk",
    en: "pdpl",
    ru: "zakon-o-personalnyh-dannyh",
    ar: "kvkk",
  },
  "zakon-o-personalnyh-dannyh": {
    tr: "kvkk",
    en: "pdpl",
    ru: "zakon-o-personalnyh-dannyh",
    ar: "kvkk",
  },

  "teslimat-ve-iade": {
    tr: "teslimat-ve-iade",
    en: "delivery-and-return",
    ru: "dostavka-i-vozvrat",
    ar: "altawsil-walistirja",
  },
  "delivery-and-return": {
    tr: "teslimat-ve-iade",
    en: "delivery-and-return",
    ru: "dostavka-i-vozvrat",
    ar: "altawsil-walistirja",
  },
  "dostavka-i-vozvrat": {
    tr: "teslimat-ve-iade",
    en: "delivery-and-return",
    ru: "dostavka-i-vozvrat",
    ar: "altawsil-walistirja",
  },
  "altawsil-walistirja": {
    tr: "teslimat-ve-iade",
    en: "delivery-and-return",
    ru: "dostavka-i-vozvrat",
    ar: "altawsil-walistirja",
  },

  "mesafeli-satis-sozlesmesi": {
    tr: "mesafeli-satis-sozlesmesi",
    en: "distance-sales-agreement",
    ru: "dogovor-distancionnoy-prodazhi",
    ar: "aitifaqiyat-albay-ean-bued",
  },
  "distance-sales-agreement": {
    tr: "mesafeli-satis-sozlesmesi",
    en: "distance-sales-agreement",
    ru: "dogovor-distancionnoy-prodazhi",
    ar: "aitifaqiyat-albay-ean-bued",
  },
  "dogovor-distancionnoy-prodazhi": {
    tr: "mesafeli-satis-sozlesmesi",
    en: "distance-sales-agreement",
    ru: "dogovor-distancionnoy-prodazhi",
    ar: "aitifaqiyat-albay-ean-bued",
  },
  "aitifaqiyat-albay-ean-bued": {
    tr: "mesafeli-satis-sozlesmesi",
    en: "distance-sales-agreement",
    ru: "dogovor-distancionnoy-prodazhi",
    ar: "aitifaqiyat-albay-ean-bued",
  },
};

type LanguageSwitcherProps = {
  currentLocale: Locale;
  variant?: "dark" | "light";
};

export function LanguageSwitcher({
  currentLocale,
  variant = "dark",
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const activeLocale = locales.includes(pathSegments[0] as Locale)
    ? (pathSegments[0] as Locale)
    : currentLocale;

  function getLocalizedPath(locale: Locale) {
    const segments = pathname.split("/").filter(Boolean);

    if (locales.includes(segments[0] as Locale)) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }

    const slugIndex = 1;
    const currentSlug = segments[slugIndex];

    if (currentSlug && legalSlugMap[currentSlug]) {
      segments[slugIndex] = legalSlugMap[currentSlug][locale];
    }

    return `/${segments.join("/")}`;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full p-1 backdrop-blur",
        variant === "dark"
          ? "border border-white/15 bg-black/20"
          : "border border-neutral-200 bg-white",
      )}
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition",
            locale === activeLocale
              ? "bg-brand-greenLight text-white"
              : variant === "dark"
                ? "text-white/70 hover:text-brand-ivory"
                : "text-neutral-600 hover:text-brand-green",
          )}
        >
          {labels[locale]}
        </Link>
      ))}
    </div>
  );
}