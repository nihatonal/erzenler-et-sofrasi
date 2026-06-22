import Link from 'next/link';
import { Plus } from 'lucide-react';

type AdminEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function AdminEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: AdminEmptyStateProps) {
  return (
    <div className="border border-dashed border-neutral-300 bg-[#FAF8F3] px-6 py-14 text-center">
      <h3 className="font-display text-3xl font-semibold text-dark-bg">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-500">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 bg-brand-gold px-5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-gold transition hover:bg-brand-goldLight"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}