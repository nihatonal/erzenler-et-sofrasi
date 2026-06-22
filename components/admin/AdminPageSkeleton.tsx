import { Skeleton } from '@/components/ui/Skeleton';

export function AdminPageSkeleton() {
  return (
    <>
      <div className="h-24 border-b border-neutral-200 bg-white px-6 lg:px-10">
        <div className="flex h-full items-center justify-between">
          <div>
            <Skeleton className="h-8 w-56" />
            <Skeleton className="mt-3 h-4 w-72" />
          </div>
          <Skeleton className="h-12 w-40" />
        </div>
      </div>

      <main className="flex-1 p-6 lg:p-10">
        <div className="admin-card p-4 md:p-6">
          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-12 w-full lg:w-[360px]" />
            <Skeleton className="h-12 w-full lg:w-44" />
          </div>

          <div className="mt-6 hidden space-y-4 lg:block">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-20 w-full" />
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:hidden">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-72 w-full" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}