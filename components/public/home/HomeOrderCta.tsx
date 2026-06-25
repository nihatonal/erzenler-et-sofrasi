import Link from "next/link";
import { ArrowRight, Bike, QrCode } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeOrderCtaProps = {
  locale: Locale;
};

export async function HomeOrderCta({ locale }: HomeOrderCtaProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.orderCta",
  });

  return (
    <section className="px-5 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-green p-6 text-white shadow-xl md:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,177,105,0.22),transparent_32%),radial-gradient(circle_at_85%_50%,rgba(255,255,255,0.08),transparent_30%)]" />

          <div className="relative z-10 grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-brand-gold/70 bg-white/5 text-brand-gold md:h-28 md:w-28">
              <QrCode className="h-12 w-12 md:h-14 md:w-14" />
            </div>

            <div>
              {/* <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                {t("eyebrow")}
              </p> */}

              <h2 className="w-56 md:w-[540px] mt-2 font-display text-xl font-bold leading-tight md:text-4xl lg:text-5xl">
                {t("title")}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/75 md:text-base">
                {t("description")}
              </p>
            </div>

            <Link
              href={`/${locale}/menu`}
              className="inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-brand-creamDark px-6 text-sm font-bold uppercase tracking-[0.12em] text-brand-green shadow-lg transition hover:bg-white"
            >
              <Bike className="h-4 w-4" />
              {t("button")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
