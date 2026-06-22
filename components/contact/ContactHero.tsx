import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";

import { type Locale } from "@/i18n";

type ContactHeroProps = {
  locale: Locale;
};

export async function ContactHero({ locale }: ContactHeroProps) {
  const t = await getTranslations({
    locale,
    namespace: "contactPage.hero",
  });

  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-dark-bg pt-36 text-white">
      <Image
        src="/images/contact/contact-hero.webp"
        alt="Mira Bistro Contact"
        fill
        priority
        className="object-cover opacity-85"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-dark-bg/20" />

      <Container className="relative z-10 flex min-h-[62vh] items-center">
        <Reveal>
          <div className="max-w-4xl">
            <p className="section-label text-brand-gold">{t("label")}</p>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-7xl">
              {t("title")}
            </h1>
            <div className="mt-8 h-px w-24 bg-brand-gold" />
            <p className="mt-7 max-w-2xl text-lg leading-9 text-white/75">
              {t("description")}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
