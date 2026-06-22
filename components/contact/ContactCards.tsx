import {
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/Container';
import { Reveal } from '@/components/ui/Reveal';

import { type Locale } from '@/i18n';

type ContactCardsProps = {
  locale: Locale;
};

export async function ContactCards({
  locale,
}: ContactCardsProps) {
  const t = await getTranslations({
    locale,
    namespace: 'contactPage.cards',
  });

  const items = [
    {
      icon: MapPin,
      title: t('address.title'),
      value: t('address.value'),
    },
    {
      icon: Phone,
      title: t('phone.title'),
      value: t('phone.value'),
    },
    {
      icon: Mail,
      title: t('email.title'),
      value: t('email.value'),
    },
  ];

  return (
    <section className="bg-[#FBF8F1] py-24">
      <Container>
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal
                key={item.title}
                delay={index * 0.08}
              >
                <div className="group relative overflow-hidden border border-neutral-200 bg-white p-10 transition duration-500 hover:-translate-y-1 hover:border-brand-gold hover:shadow-cardHover">
                  <div className="absolute inset-x-0 top-0 h-1 bg-brand-gold scale-x-0 transition duration-500 group-hover:scale-x-100" />

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-8 font-display text-3xl font-semibold text-dark-bg">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-lg leading-8 text-neutral-600">
                    {item.value}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}