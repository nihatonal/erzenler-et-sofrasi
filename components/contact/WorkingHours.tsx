import Image from 'next/image';
import { Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/ui/Reveal';

import { type Locale } from '@/i18n';

type WorkingHoursProps = {
  locale: Locale;
};

export async function WorkingHours({ locale }: WorkingHoursProps) {
  const t = await getTranslations({
    locale,
    namespace: 'contactPage.hours',
  });

  const hours = [
    {
      day: t('weekdays'),
      time: '10:00 - 23:00',
    },
    {
      day: t('saturday'),
      time: '10:00 - 00:00',
    },
    {
      day: t('sunday'),
      time: '11:00 - 22:00',
    },
  ];

  return (
    <section className="bg-white py-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div>
              <p className="section-label">{t('label')}</p>

              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-dark-bg md:text-6xl">
                {t('title')}
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-neutral-600">
                {t('description')}
              </p>

              <div className="mt-10 overflow-hidden border border-neutral-200 bg-[#FBF8F1] shadow-card">
                {hours.map((item, index) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between gap-6 border-b border-neutral-200 px-6 py-5 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                        <Clock className="h-5 w-5" />
                      </div>

                      <span className="font-semibold text-dark-bg">
                        {item.day}
                      </span>
                    </div>

                    <span className="text-sm font-bold tracking-[0.12em] text-brand-gold">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative h-[560px] overflow-hidden border border-neutral-200 shadow-card">
              <Image
                src="/images/contact/contact-hours.webp"
                alt="Mira Bistro opening hours"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 border border-white/15 bg-black/35 p-6 text-white backdrop-blur">
                <p className="font-display text-3xl">Mira Bistro</p>
                <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/65">
                  Open Daily
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}