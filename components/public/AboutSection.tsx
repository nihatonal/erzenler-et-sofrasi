import Image from "next/image";
import { ChefHat, Heart, Leaf } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSection() {
  const t = useTranslations("home.about");

  const features = [
    {
      icon: Leaf,
      title: t("featureIngredients"),
      description: t("featureIngredientsDesc"),
    },
    {
      icon: ChefHat,
      title: t("featureChefs"),
      description: t("featureChefsDesc"),
    },
    {
      icon: Heart,
      title: t("featureGuests"),
      description: t("featureGuestsDesc"),
    },
  ];

  return (
    <section className="bg-brand-cream py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="overflow-hidden rounded-[6px] shadow-card">
              <div className="relative h-[360px] w-full md:h-[430px]">
                <Image
                  src="/images/about-restaurant.webp"
                  alt="Mira Bistro restaurant interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading
              label={t("label")}
              title={t("title")}
              description={t("description")}
            />

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-brand-gold">
                      <Icon className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-dark-bg">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
