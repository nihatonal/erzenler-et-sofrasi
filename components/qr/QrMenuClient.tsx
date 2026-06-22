"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

import { formatPreparationTime, formatPortion } from "@/lib/formatters";

import { type Locale } from "@/i18n";
import { type RestaurantTable } from "@/data/tables";
import { formatCurrency } from "@/lib/utils";
import { LanguageSwitcher } from "../language/LanguageSwitcher";
import { SafeImage } from "../ui/SafeImage";

type QrProduct = {
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
};

type QrCategory = {
  id: string;
  slug: string;
  name: Record<Locale, string>;
};

type QrMenuClientProps = {
  locale: Locale;
  table: RestaurantTable;
  categories: QrCategory[];
  products: QrProduct[];
};

export function QrMenuClient({
  locale,
  table,
  categories,
  products,
}: QrMenuClientProps) {
  const t = useTranslations("menuPage");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }

    return products.filter((item) => item.categorySlug === activeCategory);
  }, [activeCategory, products]);

  return (
    <main className="min-h-screen bg-[#FBF8F1] pb-24">
      <section
        className={`sticky top-0 z-[99] border-b border-white/10 bg-dark-bg text-white shadow-lg transition-all duration-300 ${
          isScrolled ? "px-5 py-3" : "px-5 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <p
              className={`uppercase tracking-[0.24em] text-brand-gold transition-all duration-300 ${
                isScrolled ? "text-[10px]" : "text-xs"
              }`}
            >
              Mira Bistro
            </p>

            {/* <h1
              className={`mt-1 font-display font-semibold transition-all duration-300 ${
                isScrolled ? "text-xl" : "text-[24px]"
              }`}
            >
              QR Menü
            </h1> */}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} variant="dark" />

            {/* <div
              className={`rounded-full border border-brand-gold/40 text-brand-gold transition-all duration-300 ${
                isScrolled ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-xs"
              }`}
            >
              {table.label}
            </div> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5">
        {/* <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
          <p className="text-sm leading-7 text-neutral-600">
            Menümüzü inceleyebilir, beğendiğiniz ürünleri garsonumuza
            iletebilirsiniz.
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-brand-gold" />
              {table.capacity} kişilik
            </span>

            <span>Servis aktif</span>
          </div>
        </div> */}

        <div
          className={`sticky z-[99] -mx-5 mt-0 border-y border-neutral-200 bg-[#FBF8F1]/95 px-5 pt-3 backdrop-blur transition-all duration-300 ${
            isScrolled ? "top-[58px]" : "top-[66px]"
          }`}
        >
          <div className="flex gap-3 overflow-x-auto pb-3 md:pb-2">
            {[
              {
                id: "all",
                slug: "all",
                name: { tr: t("all"), en: t("all"), ru: t("all") },
              },
              ...categories,
            ].map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`relative z-[70] shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                  activeCategory === category.slug
                    ? "bg-brand-gold text-white"
                    : "border border-neutral-300 bg-white text-neutral-700"
                }`}
              >
                {category.name[locale]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/menu/${item.slug}?source=qr&table=${table.slug}`}
              className="grid min-h-[148px] grid-cols-[112px_1fr] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition active:scale-[0.99] hover:shadow-cardHover"
            >
              <div className="relative z-40 min-h-[132px]">
                <SafeImage
                  src={item.image}
                  alt={item.name[locale]}
                  fill
                  unoptimized={item.image.startsWith("https://")}
                  className="object-cover relative z-20"
                  sizes="112px"
                  loading="eager"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 font-display text-[19px] font-semibold leading-snug text-dark-bg sm:text-xl">
                    {item.name[locale]}
                  </h2>
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-6 text-neutral-600">
                  {item.description[locale]}
                </p>

                <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-brand-gold" />
                    {formatPreparationTime(item.preparationMinutes, locale)}
                  </span>

                  <span>{formatPortion(item.portionCount, locale)}</span>

                  <p className="shrink-0 text-sm font-bold text-brand-gold">
                    {locale === "tr"
                      ? formatCurrency(item.priceTry, "TRY")
                      : formatCurrency(item.priceUsd, "USD")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
