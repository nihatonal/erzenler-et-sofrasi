import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Bike,
  Clock,
  Clock3,
  CreditCard,
  MapPin,
  MessageCircle,
  Phone,
  Route,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeContactLocationProps = {
  locale: Locale;
};

const paymentKeys = [
  "cash",
  "card",
  "sodexo",
  "multinet",
  "edenred",
  "setcard",
  "pluxee",
] as const;

const trustItems = [
  {
    key: "experience",
    icon: Award,
  },
  {
    key: "open",
    icon: Clock3,
  },
  {
    key: "delivery",
    icon: Bike,
  },
  {
    key: "payment",
    icon: CreditCard,
  },
] as const;

export async function HomeContactLocation({
  locale,
}: HomeContactLocationProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.contact",
  });

  return (
    <section id="contact" className="px-5 py-16 md:px-8 md:py-24 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
            {t("eyebrow")}
          </p>

          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
            {t("title")}
          </h2>

          <div className="mx-auto mt-4 h-px w-20 bg-brand-sand" />
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-brand-sand bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="grid gap-5">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-brand-green">
                      {t("addressTitle")}
                    </h3>
                    <Link
                      href={t("mapsUrl")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm leading-7 text-brand-muted"
                    >
                      {t("address")}
                    </Link>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-brand-green">
                      {t("phoneTitle")}
                    </h3>
                    <div className="mt-1 flex flex-col gap-1">
                      <Link
                        href="tel:+905445182342"
                        className="text-sm font-semibold text-brand-muted transition hover:text-brand-red"
                      >
                        0544 518 23 42
                      </Link>
                      <Link
                        href="tel:+902125964155"
                        className="text-sm font-semibold text-brand-muted transition hover:text-brand-red"
                      >
                        0212 596 41 55
                      </Link>
                      <Link
                        href="tel:+902125964142"
                        className="text-sm font-semibold text-brand-muted transition hover:text-brand-red"
                      >
                        0212 596 41 42
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <MessageCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-brand-green">
                      {t("whatsappTitle")}
                    </h3>
                    <Link
                      href="https://wa.me/905445182342"
                      target="_blank"
                      className="mt-1 block text-sm font-semibold text-brand-muted transition hover:text-brand-red"
                    >
                      0544 518 23 42
                    </Link>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <Clock className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-brand-green">
                      {t("hoursTitle")}
                    </h3>
                    <p className="mt-1 text-sm leading-7 text-brand-muted">
                      {t("hours")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-brand-sand pt-7">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                  {t("paymentTitle")}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {paymentKeys.map((key) => (
                    <span
                      key={key}
                      className="rounded-full border border-brand-sand bg-brand-cream px-4 py-2 text-sm font-semibold text-brand-green"
                    >
                      {t(`payments.${key}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={t("mapsUrl")}
              target="_blank"
              className="group relative min-h-[280px] overflow-hidden border-t border-brand-sand bg-brand-cream lg:border-l lg:border-t-0"
            >
              <Image
                src="/images/home/map-preview.png"
                alt={t("mapAlt")}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />

              <div className="absolute inset-0 bg-brand-green/10" />

              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-white shadow-xl">
                  <MapPin className="h-8 w-8 fill-current" />
                </div>

                <div className="mt-4 rounded-2xl bg-white px-5 py-3 shadow-lg">
                  <p className="font-bold text-brand-red">
                    {t("mapRestaurantName")}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-brand-muted">
                    {t("mapHint")}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="border-t border-brand-sand p-5 md:hidden">
            <Link
              href={t("mapsUrl")}
              target="_blank"
              className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-brand-red bg-white text-sm font-bold uppercase tracking-[0.12em] text-brand-red transition hover:bg-brand-red hover:text-white"
            >
              <Route className="h-4 w-4" />
              {t("directionButton")}
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="group rounded-2xl border border-brand-sand bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-red"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-brand-green">
                  {t(`trust.${item.key}.title`)}
                </h3>

                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  {t(`trust.${item.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
