"use client";

import Image from "next/image";
import { X, Play } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { type Locale } from "@/i18n";

type HomeVideoSectionProps = {
  locale: Locale;
};

const youtubeVideoId = "n9Va_317Xuo";

export function HomeVideoSection({ locale }: HomeVideoSectionProps) {
  const t = useTranslations("home.video");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-green">
            <div className="relative min-h-[420px] md:min-h-[560px]">
              <Image
                src="/images/home/video-cover.webp"
                alt={t("imageAlt")}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />

              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="group flex h-20 w-20 items-center justify-center rounded-full bg-white text-brand-red shadow-2xl transition hover:scale-105 md:h-24 md:w-24"
                  aria-label={t("play")}
                >
                  <Play className="ml-1 h-9 w-9 fill-current md:h-11 md:w-11" />
                </button>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                  {t("eyebrow")}
                </p>

                <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
                  {t("title")}
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                  {t("description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-green shadow-lg"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title={t("title")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}