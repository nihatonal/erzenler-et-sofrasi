import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FBF8F1] pb-24 pt-12">
      <div className="mx-auto max-w-7xl px-6">
        <Skeleton className="h-5 w-40" />

        <section className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Skeleton className="h-[620px] w-full" />

          <div className="flex flex-col justify-center">
            <Skeleton className="h-4 w-32" />

            <Skeleton className="mt-6 h-16 w-full max-w-lg" />

            <Skeleton className="mt-8 h-6 w-full" />
            <Skeleton className="mt-3 h-6 w-5/6" />
            <Skeleton className="mt-3 h-6 w-4/6" />

            <Skeleton className="mt-10 h-10 w-40" />

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>

            <div className="mt-10 flex gap-4">
              <Skeleton className="h-14 w-44" />
              <Skeleton className="h-14 w-44" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}