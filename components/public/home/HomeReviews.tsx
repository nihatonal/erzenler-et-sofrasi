import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeReviewsProps = {
  locale: Locale;
};

const reviews = ["first", "second", "third"] as const;

export async function HomeReviews({ locale }: HomeReviewsProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.reviews",
  });

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
              {t("eyebrow")}
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-brand-muted md:text-base">
              {t("description")}
            </p>

            {/* <div className="mt-8 inline-flex items-center gap-4 rounded-3xl border border-brand-sand bg-white px-5 py-4 shadow-sm">
              <div>
                <div className="flex gap-1 text-brand-red">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star key={item} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                <p className="mt-2 text-sm font-semibold text-brand-green">
                  {t("ratingText")}
                </p>
              </div>

              <div className="h-12 w-px bg-brand-sand" />

              <div>
                <p className="text-3xl font-bold text-brand-green">
                  {t("rating")}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                  {t("google")}
                </p>
              </div>
            </div> */}
          </div>

          <div className="grid gap-4">
            {reviews.map((reviewKey) => (
              <article
                key={reviewKey}
                className="rounded-3xl border border-brand-sand bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-brand-green">
                      {t(`items.${reviewKey}.name`)}
                    </h3>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                      {t(`items.${reviewKey}.source`)}
                    </p>
                  </div>

                  <div className="flex gap-0.5 text-brand-red">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Star key={item} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-brand-muted">
                  “{t(`items.${reviewKey}.comment`)}”
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
