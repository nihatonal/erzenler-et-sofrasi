import Image from "next/image";
import { QrCode, ScanLine, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";

export function QrExperienceSection() {
  const t = useTranslations("home.qr");

  const steps = [
    {
      icon: QrCode,
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      icon: ScanLine,
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      icon: Heart,
      title: t("step3Title"),
      description: t("step3Desc"),
    },
  ];

  return (
    <section className="bg-dark-bg py-24 text-white md:py-32">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_520px]">
          <Reveal>
            <SectionHeading
              dark
              label={t("label")}
              title={t("title")}
              description={t("description")}
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div key={step.title}>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/30 bg-white/5 text-brand-gold">
                      <Icon className="h-7 w-7 stroke-[1.5]" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>

                    <p className="mt-3 text-sm leading-7 text-white/60">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute inset-0 rounded-[32px] bg-brand-gold/10 blur-3xl" />
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="relative h-[620px] w-full overflow-hidden rounded-[20px]">
                  <Image
                    src="/images/qr-menu-display.webp"
                    alt="QR Menu Display"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 520px"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
