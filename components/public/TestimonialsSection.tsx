import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { Container } from "@/components/layout/Container";

const testimonials = [
  {
    name: "Ayşe Yılmaz",
    source: "Google Yorumu",
    text: "Yemekler harikaydı, çalışanlar çok ilgiliydi. Atmosfer mükemmel, kesinlikle tekrar geleceğiz.",
    image: "/images/testimonials/user_1.webp",
  },
  {
    name: "Mehmet Kaya",
    source: "Google Yorumu",
    text: "Mira Bistro lezzet, kalite ve hizmet konusunda beklentilerimin çok üstünde. Tavsiye ederim.",
    image: "/images/testimonials/user_2.webp",
  },
  {
    name: "Daniel Johnson",
    source: "Google Yorumu",
    text: "QR menü sistemi çok pratik ve menü çeşitliliği çok fazla. Her şey modern, hızlı ve keyifli.",
    image: "/images/testimonials/user_3.webp",
  },
];

export function TestimonialsSection() {
  const t = useTranslations("home.testimonials");

  return (
    <section className="bg-brand-cream py-24 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading centered label={t("label")} title={t("title")} />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="border border-neutral-200 bg-[#FBF8F1] px-8 py-10 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-cardHover"
              >
                <div className="text-6xl font-display leading-none text-brand-gold">
                  “
                </div>

                <p className="mt-4 min-h-[120px] text-sm leading-8 text-neutral-700">
                  {item.text}
                </p>

                <div className="mx-auto mt-8 h-px w-20 bg-brand-gold/70" />

                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="text-left">
                    <h3 className="font-display text-xl font-semibold text-dark-bg">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500">
                      {item.source}
                    </p>

                    <div className="mt-2 flex gap-1 text-brand-gold">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
