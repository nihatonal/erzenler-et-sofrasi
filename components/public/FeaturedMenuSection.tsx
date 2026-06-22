import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MenuCard } from "@/components/public/MenuCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { type Locale } from "@/i18n";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FeaturedMenuSectionProps = {
  locale: Locale;
};

export async function FeaturedMenuSection({
  locale,
}: FeaturedMenuSectionProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.featuredMenu",
  });

  const supabase = await createSupabaseServerClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name_tr,
      name_en,
      name_ru,
      description_tr,
      description_en,
      description_ru,
      image_url,
      price_try,
      price_usd
    `,
    )
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(4);

  if (error) {
    throw new Error(error.message);
  }

  const items =
    products?.map((item) => ({
      id: item.id,
      title:
        locale === "tr"
          ? item.name_tr
          : locale === "en"
            ? item.name_en
            : item.name_ru,
      description:
        locale === "tr"
          ? item.description_tr
          : locale === "en"
            ? item.description_en
            : item.description_ru,
      priceTry: Number(item.price_try ?? 0),
      priceUsd: Number(item.price_usd ?? 0),
      image: item.image_url || "/images/menu/fettuccine.png",
    })) ?? [];

  return (
    <section className="bg-brand-cream py-12 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading centered label={t("label")} title={t("title")} />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <MenuCard
                key={item.id}
                title={item.title}
                description={item.description}
                price={locale === "tr" ? item.priceTry : item.priceUsd}
                image={item.image}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 flex justify-center">
            <Button
              href={`/${locale}/menu`}
              size="md"
              className="rounded-none px-8"
            >
              {t("cta")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
