export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-none bg-neutral-200/70 ${className}`}
    />
  );
}