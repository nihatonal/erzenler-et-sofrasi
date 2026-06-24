import { CheckoutClient } from "@/components/public/checkout/CheckoutClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type CheckoutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;

  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  if (!restaurantId) {
    throw new Error("NEXT_PUBLIC_RESTAURANT_ID env eksik.");
  }

  return <CheckoutClient locale={locale} restaurantId={restaurantId} />;
}
