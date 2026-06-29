import Image from "next/image";
import { Coffee, Users, Trees, Armchair } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeDiningRoomProps = {
  locale: Locale;
};

const features = [
  {
    key: "family",
    icon: Users,
  },
  {
    key: "comfortable",
    icon: Armchair,
  },
  {
    key: "fresh",
    icon: Trees,
  },
  {
    key: "tea",
    icon: Coffee,
  },
] as const;

export async function HomeDiningRoom({
  locale,
}: HomeDiningRoomProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.diningRoom",
  });

  return (
    <section className="bg-brand-cream px-5 pt-20 pb-16 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* IMAGE */}

          <div className="relative overflow-hidden rounded-[32px]">

            <div className="relative aspect-[4/3]">

              <Image
                src="/images/home/dining-room.webp"
                alt={t("imageAlt")}
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(min-width:1024px) 50vw,100vw"
              />

            </div>

          </div>

          {/* CONTENT */}

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
              {t("eyebrow")}
            </p>

            <h2 className="mt-3 font-display text-4xl text-brand-green md:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-6 text-base leading-8 text-brand-muted">
              {t("description")}
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">

              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-brand-sand bg-white p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
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

            <div className="mt-10 rounded-2xl bg-brand-green px-7 py-6 text-white">

              <p className="text-lg font-display">
                {t("bottomTitle")}
              </p>

              <p className="mt-2 text-sm leading-7 text-white/80">
                {t("bottomDescription")}
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}