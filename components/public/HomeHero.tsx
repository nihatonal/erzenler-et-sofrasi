import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { type Locale } from "@/i18n";

type HomeHeroProps = {
  locale: Locale;
};

export function HomeHero({ locale }: HomeHeroProps) {
  const t = useTranslations("home.hero");

  return (
    <section className="relative min-h-screen overflow-hidden bg-dark-bg text-white">
      {/* Desktop background */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: "url('/images/hero-desktop.webp')" }}
      />

      {/* Mobile background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/images/hero-mobile.webp')" }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

      <Container className="relative z-10 flex min-h-screen items-center pt-28">
        <div className="max-w-3xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.35em] text-brand-gold md:text-sm">
            {t("tagline")}
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            {t("title")}
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/80 md:text-lg">
            {t("description")}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={`/${locale}/menu`} size="lg"  className="rounded-none">
              {t("ctaMenu")}
            </Button>

            <Button href={`/${locale}/reservations`} variant="dark" size="lg" className="rounded-none">
              {t("ctaReservation")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
