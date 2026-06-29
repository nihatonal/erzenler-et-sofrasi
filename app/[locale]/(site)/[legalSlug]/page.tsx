import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LegalPageKey =
  | "privacy"
  | "cookies"
  | "kvkk"
  | "delivery-return"
  | "distance-sales";

type LegalPageProps = {
  params: Promise<{
    locale: string;
    legalSlug: string;
  }>;
};

const slugMap: Record<string, LegalPageKey> = {
  "gizlilik-politikasi": "privacy",
  "privacy-policy": "privacy",
  "politika-konfidencialnosti": "privacy",
  "siyasat-alkhususiya": "privacy",

  "cerez-politikasi": "cookies",
  "cookie-policy": "cookies",
  "politika-cookie": "cookies",
  "siyasat-cookies": "cookies",

  kvkk: "kvkk",
  pdpl: "kvkk",
  "zakon-o-personalnyh-dannyh": "kvkk",

  "teslimat-ve-iade": "delivery-return",
  "delivery-and-return": "delivery-return",
  "dostavka-i-vozvrat": "delivery-return",
  "altawsil-walistirja": "delivery-return",

  "mesafeli-satis-sozlesmesi": "distance-sales",
  "distance-sales-agreement": "distance-sales",
  "dogovor-distancionnoy-prodazhi": "distance-sales",
  "aitifaqiyat-albay-ean-bued": "distance-sales",
};

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  const { locale, legalSlug } = await params;
  const pageKey = slugMap[legalSlug];

  if (!pageKey) return {};

  const t = await getTranslations({
    locale,
    namespace: "legal",
  });

  return {
    title: t(`${pageKey}.title`),
    description: t(`${pageKey}.description`),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale, legalSlug } = await params;
  const pageKey = slugMap[legalSlug];

  if (!pageKey) notFound();

  const t = await getTranslations({
    locale,
    namespace: "legal",
  });

  const sections = t.raw(`${pageKey}.sections`) as {
    heading: string;
    body: string;
  }[];

  const supabase = await createSupabaseServerClient();

  const { data: settings } = await supabase
    .from("restaurant_settings")
    .select("restaurant_name")
    .eq("restaurant_id", process.env.NEXT_PUBLIC_RESTAURANT_ID!)
    .single();

  const restaurantName = settings?.restaurant_name || "Restaurant";

  return (
    <main className="min-h-screen bg-brand-cream px-5 pt-28 pb-20">
      <section className="mx-auto max-w-4xl rounded-3xl border border-brand-sand bg-brand-ivory p-6 shadow-sm md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
          {restaurantName}
        </p>

        <h1 className="mt-4 text-3xl font-bold text-brand-green md:text-5xl">
          {t(`${pageKey}.title`)}
        </h1>

        <p className="mt-4 text-sm leading-7 text-brand-muted">
          {t(`${pageKey}.description`)}
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((_, index) => (
            <section key={index}>
              <h2 className="text-xl font-bold text-brand-green">
                {t(`${pageKey}.sections.${index}.heading`)}
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-brand-muted">
                {t(`${pageKey}.sections.${index}.body`, {
                  restaurantName,
                })}
              </p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
