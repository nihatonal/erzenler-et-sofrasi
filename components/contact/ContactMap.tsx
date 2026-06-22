import { MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/ui/Reveal';

import { type Locale } from '@/i18n';

type ContactMapProps = {
  locale: Locale;
};

export async function ContactMap({
  locale,
}: ContactMapProps) {
  const t = await getTranslations({
    locale,
    namespace: 'contactPage.map',
  });

  return (
    <section className="bg-[#FBF8F1] py-24">
      <Container>
        <Reveal>
          <div className="text-center">
            <p className="section-label justify-center">
              {t('label')}
            </p>

            <h2 className="mt-5 font-display text-4xl font-semibold text-dark-bg md:text-6xl">
              {t('title')}
            </h2>

            <div className="mx-auto mt-6 h-px w-24 bg-brand-gold" />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-14 overflow-hidden border border-neutral-200 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Mira Bistro
                  </p>

                  <p className="mt-1 font-semibold text-dark-bg">
                    Bağdat Caddesi No:24, İstanbul
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="hidden border border-neutral-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-dark-bg transition hover:border-brand-gold hover:text-brand-gold md:inline-flex"
              >
                Open Maps
              </a>
            </div>

            <div className="relative h-[560px] w-full">
              <iframe
                src="https://www.google.com/maps?q=Istanbul&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale contrast-125"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}