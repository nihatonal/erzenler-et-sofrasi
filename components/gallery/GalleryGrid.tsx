'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { type Locale } from '@/i18n';

type GalleryCategory =
  | 'all'
  | 'food'
  | 'interior'
  | 'ambience';

type GalleryItem = {
  id: number;
  image: string;
  category: Exclude<GalleryCategory, 'all'>;
};

type GalleryGridProps = {
  locale: Locale;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: '/images/gallery/gallery-1.webp',
    category: 'food',
  },
  {
    id: 2,
    image: '/images/gallery/gallery-2.webp',
    category: 'interior',
  },
  {
    id: 3,
    image: '/images/gallery/gallery-3.webp',
    category: 'ambience',
  },
  {
    id: 4,
    image: '/images/gallery/gallery-4.webp',
    category: 'food',
  },
  {
    id: 5,
    image: '/images/gallery/gallery-5.webp',
    category: 'interior',
  },
  {
    id: 6,
    image: '/images/gallery/gallery-6.webp',
    category: 'ambience',
  },
  {
    id: 7,
    image: '/images/gallery/gallery-7.webp',
    category: 'food',
  },
  {
    id: 8,
    image: '/images/gallery/gallery-8.webp',
    category: 'interior',
  },
   {
    id: 9,
    image: '/images/gallery/gallery-9.webp',
    category: 'food',
  },
];

export function GalleryGrid({
}: GalleryGridProps) {
  const t = useTranslations('galleryPage.filters');

  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>('all');

  const categories: GalleryCategory[] = [
    'all',
    'food',
    'interior',
    'ambience',
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return galleryItems;
    }

    return galleryItems.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <section className="bg-[#FBF8F1] py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setActiveCategory(category)
              }
              className={cn(
                'rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] transition',
                activeCategory === category
                  ? 'border-brand-gold bg-brand-gold text-white shadow-gold'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-brand-gold hover:text-brand-gold'
              )}
            >
              {t(category)}
            </button>
          ))}
        </div>

        <div className="mt-16 columns-1 gap-6 sm:columns-2 xl:columns-3">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'group relative mb-6 overflow-hidden border border-neutral-200 bg-white shadow-card',
                index % 3 === 0
                  ? 'aspect-[4/5]'
                  : index % 2 === 0
                    ? 'aspect-square'
                    : 'aspect-[4/3]'
              )}
            >
              <Image
                src={item.image}
                alt="Mira Bistro Gallery"
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1280px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 right-0 translate-y-8 p-6 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                  {t(item.category)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}