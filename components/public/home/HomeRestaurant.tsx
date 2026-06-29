import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeRestaurantProps = {
  locale: Locale;
};

export async function HomeRestaurant({
  locale,
}: HomeRestaurantProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.restaurant",
  });

  return (
    <section className="overflow-hidden bg-brand-green py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:grid-cols-2 md:px-8">

        {/* LEFT */}

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            {t("eyebrow")}
          </p>

          <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            {t("title")}
          </h2>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/75">
            {t("description")}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">

            <div>
              <div className="text-4xl font-display text-brand-gold">
                30+
              </div>

              <p className="mt-2 text-sm text-white/70">
                {t("experience")}
              </p>
            </div>

            <div>
              <div className="text-4xl font-display text-brand-gold">
                7/24
              </div>

              <p className="mt-2 text-sm text-white/70">
                {t("service")}
              </p>
            </div>

          </div>

          {/* <Link
            href="/gallery"
            className="mt-10 inline-flex h-14 items-center gap-3 rounded-full border border-brand-gold px-7 text-sm font-bold uppercase tracking-[0.15em] transition hover:bg-brand-gold hover:text-brand-green"
          >
            {t("button")}

            <ArrowRight className="h-4 w-4" />
          </Link> */}
        </div>

        {/* RIGHT */}

        <div className="relative">

          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px]">

            <Image
              src="/images/home/restaurant-exterior.webp"
              alt={t("imageAlt")}
              fill
              className="object-cover"
              sizes="(min-width:768px) 50vw,100vw"
            />

          </div>

        </div>

      </div>
    </section>
  );
}