import Image from "next/image";
import { Award, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeWhyErzenlerProps = {
  locale: Locale;
};

const items = [
  {
    key: "experience",
    icon: Award,
  },
  {
    key: "fresh",
    icon: Sparkles,
  },
  {
    key: "team",
    icon: CheckCircle2,
  },
  {
    key: "hygiene",
    icon: ShieldCheck,
  },
] as const;

export async function HomeWhyErzenler({ locale }: HomeWhyErzenlerProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.whyErzenler",
  });

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 rounded-[2rem] border border-brand-sand bg-white p-6 shadow-sm md:grid-cols-[0.95fr_1.05fr] md:p-10 lg:p-12">
          <div className="relative overflow-hidden rounded-[1.7rem] bg-brand-green min-h-[420px] md:min-h-[560px]">
            <Image
              src="/images/home/why-erzenler-team.webp"
              alt={t("imageAlt")}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 45vw, 100vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/35 p-4 text-white backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                {t("imageBadge")}
              </p>
              <p className="mt-1 text-sm leading-6 text-white/80">
                {t("imageText")}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
              {t("eyebrow")}
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 text-sm leading-7 text-brand-muted md:text-base">
              {t("description")}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-brand-sand bg-brand-cream p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 font-bold text-brand-green">
                      {t(`items.${item.key}.title`)}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-brand-muted">
                      {t(`items.${item.key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
