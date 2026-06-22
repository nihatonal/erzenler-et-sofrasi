'use client';

import { cn } from '@/lib/utils';

type MenuCategoryFilterProps = {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  labels: Record<string, string>;
};

export function MenuCategoryFilter({
  categories,
  activeCategory,
  onChange,
  labels,
}: MenuCategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {['all', ...categories].map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            'rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] transition',
            activeCategory === category
              ? 'border-brand-gold bg-brand-gold text-white shadow-gold'
              : 'border-neutral-300 bg-white text-neutral-700 hover:border-brand-gold hover:text-brand-gold'
          )}
        >
          {labels[category]}
        </button>
      ))}
    </div>
  );
}