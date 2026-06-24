import { PublicMenuClient } from "@/components/public/menu/PublicMenuClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type MenuPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    table?: string;
  }>;
};

export default async function MenuPage({
  params,
  searchParams,
}: MenuPageProps) {
  const { locale } = await params;
  const { table } = await searchParams;

  const restaurantId =
    process.env.NEXT_PUBLIC_RESTAURANT_ID ||
    "079f545e-d21f-4fe0-8ac6-265aeefceeee";

  if (!restaurantId) {
    throw new Error("NEXT_PUBLIC_RESTAURANT_ID env eksik.");
  }

  return (
    <PublicMenuClient
      locale={locale}
      restaurantId={restaurantId}
      tableSlug={table || null}
    />
  );
}
