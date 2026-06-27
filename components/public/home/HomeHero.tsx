import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeHeroProps = {
  locale: Locale;
};

export async function HomeHero({ locale }: HomeHeroProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.hero",
  });

  return (
    <section id="home-hero" className="relative min-h-[calc(100svh-76px)] overflow-hidden bg-black lg:min-h-[calc(100vh-96px)]">
      <Image
        src="/images/home/erzenler-hero-kebap.webp"
        alt={t("imageAlt")}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-6xl items-center px-5 py-24 lg:min-h-[calc(100vh-96px)] lg:px-8">
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            {t("eyebrow")}
          </p>

          <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-tight md:text-7xl">
            {t("title")}
          </h1>

          <p className="mt-6 max-w-md text-base leading-8 text-white/85 md:text-lg">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/menu`}
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-brand-red px-6 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-xl transition hover:bg-brand-redLight"
            >
              {t("menuButton")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="tel:+905445182342"
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl border border-white/70 bg-white/5 px-6 text-sm font-bold uppercase tracking-[0.12em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green"
            >
              {t("orderButton")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <span className="h-[2px] w-12 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white/70" />
            <span className="h-2 w-2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
