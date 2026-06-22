import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  dark?: boolean;
  className?: string;
};

export function SectionHeading({
  label,
  title,
  description,
  centered = false,
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && 'text-center', className)}>
      {label && (
        <p className={cn('section-label', centered && 'justify-center')}>
          {label}
        </p>
      )}

      <h2
        className={cn(
          'mt-4 text-4xl font-semibold leading-tight md:text-5xl',
          dark ? 'text-white' : 'text-dark-bg'
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'mt-6 max-w-2xl text-base leading-8',
            dark ? 'text-white/70' : 'text-neutral-600',
            centered && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}

      <div className={cn('mt-5 h-px w-24 bg-brand-gold', centered && 'mx-auto')} />
    </div>
  );
}