import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Container } from "@/components/layout/Container";

const contactItems = [
  {
    icon: MapPin,
    labelKey: "addressLabel",
    value: "Cumhuriyet Cad. No: 12\nKadıköy / İstanbul",
  },
  {
    icon: Phone,
    labelKey: "phoneLabel",
    value: "+90 555 123 45 67",
  },
  {
    icon: Mail,
    labelKey: "emailLabel",
    value: "info@mirabistro.com",
  },
  {
    icon: Clock,
    labelKey: "hoursLabel",
    value: "Her Gün 11:00 - 23:00",
  },
];

export function ContactSection() {
  const t = useTranslations("home.contact");

  return (
    <section className="bg-[#FBF8F1] py-24 md:py-28">
      <Container>
        <Reveal>
          <div className="grid overflow-hidden border border-neutral-200 bg-brand-cream shadow-card lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 md:p-12 lg:p-16">
              <SectionHeading label={t("label")} title={t("title")} />
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.labelKey} className="flex gap-4">
                      <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                        <Icon className="h-5 w-5 stroke-[1.7]" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-dark-bg">
                          {t(item.labelKey)}
                        </h3>

                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-600">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[360px] lg:min-h-[520px]">
              <Image
                src="/images/map-preview.webp"
                alt="Mira Bistro map location"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
                loading="eager"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
