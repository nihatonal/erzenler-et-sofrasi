import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg';

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonProps =
  | (BaseProps &
      React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
      })
  | (BaseProps & {
      href: string;
      target?: string;
      rel?: string;
    });

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gold text-white shadow-gold hover:bg-brand-goldLight active:bg-brand-goldDark',
  outline:
    'border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white',
  ghost:
    'text-white/80 hover:text-brand-gold hover:bg-white/5',
  dark:
    'bg-dark-bg text-white border border-white/15 hover:border-brand-gold hover:text-brand-gold',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-xs',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-sm md:text-base',
};

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...rest
  } = props;

  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.12em] transition duration-200 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  );

  if ('href' in rest && rest.href) {
    const { href, target, rel } = rest;

    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}