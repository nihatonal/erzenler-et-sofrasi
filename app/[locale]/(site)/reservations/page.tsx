import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { locales, type Locale } from "@/i18n";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ReservationForm } from "@/components/reservations/ReservationForm";

import { createReservationAction } from "./actions";
import { createMetadata } from "@/lib/seo";

type ReservationsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "metadata.reservations",
  });

  return createMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    path: "/reservations",
    image: "/og/reservations.webp",
  });
}

export default async function ReservationsPage({
  params,
}: ReservationsPageProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "reservationPage.hero",
  });

  const action = createReservationAction.bind(null, locale);

  return (
    <main className="min-h-screen bg-[#FBF8F1] pb-24">
      <section className="relative overflow-hidden bg-dark-bg pt-36 pb-28 text-white md:pt-44 md:pb-36">
        <Image
          src="/images/reservations/reservation-hero.webp"
          alt="Mira Bistro Reservation"
          fill
          priority
          className="object-cover opacity-85"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-dark-bg/24" />

        <Container className="relative z-10">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <p className="section-label justify-center text-brand-gold">
                {t("label")}
              </p>

              <h1 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-7xl">
                {t("title")}
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-white/70">
                {t("description")}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-4xl">
              <ReservationForm action={action} />
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
