import { Skeleton } from '@/components/ui/Skeleton';

export function PublicPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#FBF8F1] pb-24">
      {/* HERO */}
      <section className="relative overflow-hidden bg-dark-bg pt-36 pb-28 md:pt-44 md:pb-36">
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full bg-neutral-800" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Skeleton className="mx-auto h-4 w-32 bg-white/20" />

          <Skeleton className="mx-auto mt-6 h-16 w-full max-w-2xl bg-white/20" />

          <Skeleton className="mx-auto mt-8 h-6 w-full max-w-xl bg-white/10" />
          <Skeleton className="mx-auto mt-3 h-6 w-2/3 bg-white/10" />
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden border border-neutral-200 bg-white"
              >
                <Skeleton className="h-72 w-full" />

                <div className="p-6">
                  <Skeleton className="h-8 w-2/3" />

                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-5/6" />

                  <Skeleton className="mt-6 h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}