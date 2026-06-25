import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeGalleryPreviewProps = {
  locale: Locale;
};

const galleryImages = [
  {
    src: "/images/home/gallery-1.webp",
    key: "first",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/home/gallery-2.webp",
    key: "second",
    className: "",
  },
  {
    src: "/images/home/gallery-3.webp",
    key: "third",
    className: "",
  },
  {
    src: "/images/home/gallery-4.webp",
    key: "fourth",
    className: "md:col-span-2",
  },
];

export async function HomeGalleryPreview({
  locale,
}: HomeGalleryPreviewProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.gallery",
  });

  return (
    <section className="bg-brand-green px-5 py-16 text-white md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              {t("eyebrow")}
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/70 md:text-base">
              {t("description")}
            </p>
          </div>

          <Link
            href={`/${locale}/gallery`}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-bold uppercase tracking-[0.12em] text-white backdrop-blur transition hover:bg-white hover:text-brand-green"
          >
            {t("button")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-4 md:auto-rows-[210px]">
          {galleryImages.map((image) => (
            <div
              key={image.key}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-black ${image.className}`}
            >
              <Image
                src={image.src}
                alt={t(`items.${image.key}`)}
                fill
                className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                sizes="(min-width: 768px) 50vw, 100vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/80">
                  {t(`items.${image.key}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
