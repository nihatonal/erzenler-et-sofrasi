import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bike, ShoppingBag } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeOrderPlatformsProps = {
  locale: Locale;
};

const platforms = [
  {
    key: "uberEats",
    logo: "/images/platforms/uber-eats2.svg",
    bg: "#06c167",
  },
  {
    key: "migros",
    logo: "/images/platforms/migros-yemek.svg",
    bg: "#fff",
  },
  {
    key: "getir",
    logo: "/images/platforms/getir-yemek.svg",
    bg: "#603dba",
  },
];

export async function HomeOrderPlatforms({ locale }: HomeOrderPlatformsProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.orderPlatforms",
  });

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 rounded-[2rem] border border-brand-sand bg-white p-6 shadow-sm md:grid-cols-[1fr_1.1fr] md:p-10 lg:p-12">
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-sand bg-brand-cream px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-red">
                <Bike className="h-4 w-4" />
                {t("eyebrow")}
              </div>

              <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
                {t("title")}
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-brand-muted md:text-base">
                {t("description")}
              </p>
            </div>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-muted">
                {t("or")}
              </p>

              <Link
                href={`/${locale}/menu`}
                className="mt-4 inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-brand-red px-6 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-brand-redLight"
              >
                <ShoppingBag className="h-4 w-4" />
                {t("siteOrderButton")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.key}
                className="group flex items-center justify-between gap-4 rounded-3xl border border-brand-sand bg-brand-cream p-4 transition hover:border-brand-red hover:bg-white md:p-5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-28 items-center justify-center rounded-2xl px-4 shadow-sm md:h-20 md:w-36
                      ${
                        platform.key === "getir"
                          ? "bg-[#603dba]"
                          : platform.key === "uberEats"
                            ? "bg-[#06c167]"
                            : "#fff"
                      }
                      `}
                  >
                    <Image
                      src={platform.logo}
                      alt={t(`items.${platform.key}.name`)}
                      width={150}
                      height={48}
                      className="max-h-10 w-auto object-contain"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-brand-green">
                      {t(`items.${platform.key}.name`)}
                    </h3>

                    <p className="mt-1 text-sm text-brand-muted">
                      {t(`items.${platform.key}.description`)}
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 shrink-0 text-brand-red transition group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
