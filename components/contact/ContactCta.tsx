import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/ui/Reveal';

import { type Locale } from '@/i18n';

type ContactCtaProps = {
  locale: Locale;
};

export async function ContactCta({
  locale,
}: ContactCtaProps) {
  const t = await getTranslations({
    locale,
    namespace: 'contactPage.cta',
  });

  return (
    <section className="relative overflow-hidden bg-dark-bg py-28 text-white">
      <Image
        src="/images/contact/contact-cta.webp"
        alt="Mira Bistro reservation"
        fill
        className="object-cover opacity-85"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/60 via-dark-bg/40 to-dark-bg/80" />

      <Container className="relative z-10">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-label justify-center text-brand-gold">
              Mira Bistro
            </p>

            <h2 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-7xl">
              {t('title')}
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-white/70">
              {t('description')}
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href={`/${locale}/reservations`}
                size="lg"
                className="rounded-none px-10"
              >
                {t('reservation')}
              </Button>

              <Button
                href={`/${locale}/menu`}
                variant="outline"
                size="lg"
                className="rounded-none border-white/20 px-10 text-white hover:bg-white hover:text-dark-bg"
              >
                {t('menu')}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}