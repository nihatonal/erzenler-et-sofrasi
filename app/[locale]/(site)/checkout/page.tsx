import { CheckoutClient } from "@/components/public/checkout/CheckoutClient";
import { buildSeoMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type CheckoutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildSeoMetadata({
    locale,
    page: "checkout",
    path: "/checkout",
    image: "/images/og/checkout-og.webp",
    index: false,
  });
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;

  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  if (!restaurantId) {
    throw new Error("NEXT_PUBLIC_RESTAURANT_ID env eksik.");
  }

  return <CheckoutClient locale={locale} restaurantId={restaurantId} />;
}
