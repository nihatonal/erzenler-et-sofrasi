import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeFlavorsProps = {
  locale: Locale;
};

const flavorCards = [
  {
    key: "kebabs",
    image: "/images/home/flavors-kebap.webp",
    href: "/menu",
  },
  {
    key: "pides",
    image: "/images/home/flavors-pide.webp",
    href: "/menu",
  },
  {
    key: "grills",
    image: "/images/home/flavors-izgara.webp",
    href: "/menu",
  },
  {
    key: "desserts",
    image: "/images/home/flavors-dessert.webp",
    href: "/menu",
  },
];

export async function HomeFlavors({ locale }: HomeFlavorsProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.flavors",
  });

  return (
    <section className="bg-brand-green px-5 py-16 text-white md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              {t("eyebrow")}
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/70 md:text-base">
              {t("description")}
            </p>
          </div>

          <Link
            href={`/${locale}/menu`}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-bold uppercase tracking-[0.12em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flavorCards.map((card) => (
            <Link
              key={card.key}
              href={`/${locale}${card.href}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <Image
                  src={card.image}
                  alt={t(`items.${card.key}.title`)}
                  fill
                  className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-3xl font-bold leading-tight">
                    {t(`items.${card.key}.title`)}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/70">
                    {t(`items.${card.key}.description`)}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
                    {t("discover")}
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
